"""Bounded finite comparison and certificate checks; never a hardware controller."""
import argparse
from dataclasses import asdict
from datetime import datetime, timezone
from fractions import Fraction
import hashlib
import itertools
import json
from pathlib import Path
import platform
import resource
import sys
import time

from bounds import intersection, waiting_certificate
from evidence import CountingB0, PossibleStateC, Report, VERSION, all_required, fact

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
CONFIG = HERE / "study.json"


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), allow_nan=False).encode()


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write(path, value):
    path.write_text(json.dumps(value, indent=2, allow_nan=False) + "\n")


def limits():
    resource.setrlimit(resource.RLIMIT_CPU, (5, 5))
    info = {"workers": 1, "cpu_limit_seconds": 5, "requested_address_space_bytes": 268435456}
    try:
        resource.setrlimit(resource.RLIMIT_AS, (268435456, 268435456))
        info.update(address_space_limit_set=True, note="OS accepted; enforcement not stress-tested")
    except (ValueError, OSError) as error:
        info.update(address_space_limit_set=False, note=str(error))
    return info


def compare(truth, k, word):
    b0, candidate = CountingB0(k), PossibleStateC(k)
    trace, first = [], {"B0": None, "C": None}
    for n, value in enumerate(word, 1):
        report = Report(str(n), value, n, n)
        a0, f0 = b0.ingest(report, n)
        ac, fc = candidate.ingest(report, n)
        for name, decision in (("B0", f0), ("C", fc)):
            if first[name] is None and decision in ("locked", "not_locked"):
                first[name] = n
        row = {"report": asdict(report), "B0_admission": a0, "C_admission": ac,
               "B0_candidates": sorted(b0.candidates), "C_states": sorted(candidate.states),
               "B0_fact": f0, "C_fact": fc,
               "truth_retained": truth in b0.candidates and truth in candidate.candidates,
               "equal": a0 == ac and f0 == fc and b0.candidates == candidate.candidates}
        trace.append(row)
    return {"truth": truth, "k": k, "word": list(word), "trace": trace,
            "first_decision_acquisitions": first,
            "passed": all(r["truth_retained"] and r["equal"] for r in trace)
                      and fact(candidate.candidates) == ("locked" if truth else "not_locked")}


def analytical_controls(config):
    controls = {}
    lower = []
    for k in config["error_budgets"]:
        observer = PossibleStateC(k)
        word = [0] * k + [1] * k
        for i, value in enumerate(word, 1):
            observer.ingest(Report(str(i), value, i, i), i)
        lower.append({"k": k, "word": word, "possible_truths": sorted(observer.candidates),
                      "needed_worst_case_valid_acquisitions": 2 * k + 1})
        assert observer.candidates == {0, 1}
    controls["lower_bound_witnesses"] = lower

    observer = PossibleStateC(1)
    packet = Report("one-acquisition", 1, 0, 0)
    first = observer.ingest(packet, 0)
    second = observer.ingest(packet, 0)
    assert first == ("accepted", "unresolved") and second == ("duplicate", "unresolved")
    controls["duplicate"] = {"first": first, "second": second,
                              "wrong_fact_if_naively_counted_twice": "locked", "generating_truth_can_be": 0}

    observer = PossibleStateC(1)
    for i in range(2):
        observer.ingest(Report(str(i), 1, i, i), i)
    controls["violated_error_budget"] = {"generating_truth": 0, "reports": [1, 1],
        "assumed_k": 1, "actual_errors": 2, "fact": fact(observer.candidates),
        "consistent_but_wrong": observer.candidates == {1}}
    assert observer.candidates == {1}  # Expected vulnerability outside the assumed model.

    observer = PossibleStateC(None)
    for i in range(8):
        observer.ingest(Report(str(i), 1, i, i), i)
    assert observer.candidates == {0, 1}
    controls["unbounded_corruption"] = {"word": [1] * 8, "possible_truths": sorted(observer.candidates),
        "infinite_witness": "The same all-one word is allowed under either constant truth with arbitrary corruption."}

    controls["B2_ideal"] = [{"truth": b, "extra_observation": b, "inferred": b, "acquisitions": 1,
                            "assumption": "A correct additional measurement; unvalidated hardware"} for b in (0, 1)]
    joint_relation = {0: {(0, 0), (1, 1)}, 1: {(0, 0), (1, 1)}}
    observed = (1, 1)
    compatible = [b for b in (0, 1) if observed in joint_relation[b]]
    assert compatible == [0, 1]
    controls["B2_common_cause"] = {"observed_pair": observed, "compatible_truths": compatible,
        "claim": "Channel duplication does not establish independent information."}
    controls["passive_interlock"] = [{"truth": b, "release_request": True, "allowed_by_ideal_interlock": bool(b)} for b in (0, 1)]
    controls["B1"] = {"status": "not_run", "workload": None, "response_time": None,
                      "information_bound": "Same-history indistinguishability also limits an operator without extra information."}
    controls["N"] = {"status": "no_observation", "possible_truths": [0, 1], "service_completion": "not_measured"}
    controls["preconditions"] = {"retention_alone_authorizes_release": all_required({"retention": True}),
        "all_declared_facts_true": all_required(dict.fromkeys(("retention", "support", "contact", "load", "circuit", "time"), True)),
        "physical_facts_verified": False}
    assert not controls["preconditions"]["retention_alone_authorizes_release"]

    boxes = []
    for c in config["box_cases"]:
        result = intersection(c["a"], c["b"])
        assert result["disjoint"] is c["expect_disjoint"]
        witness = result["witness"]
        if witness is not None:
            assert all(Fraction(lo) <= coordinate <= Fraction(hi)
                       for bounds in (c["a"], c["b"]) for coordinate, (lo, hi) in zip(witness, bounds))
        boxes.append({"id": c["id"], "inputs": {"a": c["a"], "b": c["b"]},
            "disjoint": result["disjoint"], "overlap_volume": str(result["volume"]),
            "overlap_witness": None if witness is None else list(map(str, witness)),
            "zero_volume_would_be_false_certificate": result["volume"] == 0 and not result["disjoint"]})
    controls["closed_boxes"] = boxes
    return controls


def run(output):
    caps = limits()
    started = datetime.now(timezone.utc).isoformat()
    cpu, wall = time.process_time(), time.monotonic()
    output.mkdir(parents=True, exist_ok=False)
    config = json.loads(CONFIG.read_text())
    assert config["model_version"] == VERSION
    assert config["error_budgets"] == [0, 1, 2]
    assert config["primary_history_cap"] <= 100 and config["report_cap"] <= 32
    core = {"schema_version": config["schema_version"], "model_version": VERSION,
            "evidence_scope": "declared_models_only", "physical_mapping": "unverified",
            "histories": [], "attempted": [], "exclusions": []}
    try:
        for k in config["error_budgets"]:
            for truth in (0, 1):
                for word in itertools.product((0, 1), repeat=2*k+1):
                    if sum(value != truth for value in word) > k:
                        continue  # Not a model-allowed history; domain rule, not post-hoc exclusion.
                    if len(core["attempted"]) >= config["primary_history_cap"]:
                        raise ValueError("Primary history cap exceeded")
                    core["attempted"].append({"truth": truth, "k": k, "word": list(word)})
                    record = compare(truth, k, word)
                    core["histories"].append(record)
                    if not record["passed"]:
                        raise AssertionError("Truth elimination or B0/C disagreement")
        core["controls"] = analytical_controls(config)
        voltage = config["voltage"]
        assert voltage["integer_horizon_s"] == 32
        core["voltage"] = []
        for tau, floor in itertools.product(voltage["tau_upper_s"], voltage["floor_upper"]):
            certificate = waiting_certificate(tau, floor, voltage["limit"], voltage["initial_upper"])
            core["voltage"].append({"tau_upper_s": tau, "floor_upper": floor,
                "voltage_limit": voltage["limit"], "initial_upper": voltage["initial_upper"], **certificate})
        assert len(core["histories"]) == 42 and len(core["voltage"]) == 9
    except Exception as error:
        write(output / "partial.json", core)
        write(output / "failure.json", {"type": type(error).__name__, "message": str(error), "status": "failed_retained"})
        raise
    inputs = ["research/decisions/ADR-002.md", "research/block-2/mathematics.md", "research/block-2/protocol.md",
              "research/block-2/sources.md", "backend/certificates/study.json", "backend/certificates/evidence.py",
              "backend/certificates/bounds.py", "backend/certificates/run_study.py"]
    used = resource.getrusage(resource.RUSAGE_SELF)
    summary = {"checks_passed": True, "schema_version": config["schema_version"], "model_version": VERSION,
        "mode": "analytical_model_study", "evidence_scope": "declared_models_only", "physical_validation": False,
        "histories": len(core["histories"]), "all_prefixes_equal": True,
        "false_singletons_within_model": 0, "B0_C_algorithmic_advantage": "none_in_this_declared_model",
        "acquisition_ranges": {str(k): {"min": min(r["first_decision_acquisitions"]["C"] for r in core["histories"] if r["k"] == k),
            "max": max(r["first_decision_acquisitions"]["C"] for r in core["histories"] if r["k"] == k)} for k in config["error_budgets"]},
        "zero_volume_counterexamples": sum(x["zero_volume_would_be_false_certificate"] for x in core["controls"]["closed_boxes"]),
        "voltage_cases": len(core["voltage"]), "finite_wait_certificates": sum(r["wait_s"] is not None for r in core["voltage"]),
        "core_sha256": hashlib.sha256(canonical(core)).hexdigest(),
        "input_hashes": [{"path": p, "sha256": digest(ROOT / p)} for p in inputs],
        "started_at": started, "ended_at": datetime.now(timezone.utc).isoformat(), "limits": caps,
        "cpu_seconds": time.process_time()-cpu, "wall_seconds": time.monotonic()-wall,
        "peak_rss_bytes": used.ru_maxrss if sys.platform == "darwin" else used.ru_maxrss*1024,
        "python": platform.python_version(), "platform": platform.platform(), "unmeasured": config["unmeasured"]}
    write(output / "core.json", core)
    write(output / "summary.json", summary)
    if sum(p.stat().st_size for p in output.iterdir()) > 10*1024*1024:
        raise ValueError("Output cap exceeded; files retained")
    write(output / "SHA256SUMS.json", {p.name: digest(p) for p in sorted(output.iterdir())})
    print(json.dumps({k: v for k, v in summary.items() if k != "input_hashes"}, indent=2))


def verify(output):
    manifest = json.loads((output / "SHA256SUMS.json").read_text())
    assert set(manifest) == {p.name for p in output.iterdir() if p.is_file() and p.name != "SHA256SUMS.json"}
    for name, sha256 in manifest.items():
        assert digest(output / name) == sha256
    summary = json.loads((output / "summary.json").read_text())
    core = json.loads((output / "core.json").read_text())
    assert hashlib.sha256(canonical(core)).hexdigest() == summary["core_sha256"]
    for record in summary["input_hashes"]:
        assert digest(ROOT / record["path"]) == record["sha256"]
    print(json.dumps({"integrity_valid": True, "physical_validation": False, "core_sha256": summary["core_sha256"]}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--output", type=Path, help="New directory only")
    mode.add_argument("--verify", type=Path, help="Byte/config integrity only; no scientific validation")
    args = parser.parse_args()
    if args.verify:
        verify(args.verify)
    else:
        run(args.output)
