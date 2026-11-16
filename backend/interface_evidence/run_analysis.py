"""Bounded source-semantic study, with complete witnesses and explicit scope."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import platform
import resource
import sys
import time

from engine import FIELDS, VERSION, evaluate, worlds, world_id

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]


def require(condition, message):
    if not condition:
        raise ValueError(message)


def limits():
    resource.setrlimit(resource.RLIMIT_CPU, (5, 5))
    result = {"workers": 1, "cpu_limit_s": 5, "address_space_requested_bytes": 268435456}
    try:
        resource.setrlimit(resource.RLIMIT_AS, (268435456, 268435456))
        result.update(address_space_limit_set=True, note="Enforcement not stress tested")
    except (ValueError, OSError) as error:
        result.update(address_space_limit_set=False, note=str(error))
    return result


def canonical(data):
    return json.dumps(data, sort_keys=True, separators=(",", ":"), allow_nan=False).encode()


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write(path, data):
    path.write_text(json.dumps(data, indent=2, allow_nan=False) + "\n")


def expand(reports):
    return [dict({"id": str(i), "status": "known", "unit": "category", "source": "constructed-observation",
                  "sampled_at": 0, "received_at": 0, "epoch": 0, "mode": "synthetic_fixture"}, **r)
            for i, r in enumerate(reports)]


def reference(action, w):
    # Independent explicit predicate, not the engine's requirements dictionary.
    if action == "release_support":
        return w["retained"]
    if action == "energize":
        return w["retained"] and w["contacts_made"]
    if action == "disconnect":
        return w["retained"] and w["support_secured"] and w["controller_on"] and w["source_isolated"] and w["voltage_below_limit"]
    if action == "remove_module":
        return not w["retained"] and w["support_secured"] and not w["contacts_made"] and w["source_isolated"] and w["voltage_below_limit"]
    raise ValueError("Unknown reference action")


def run(output):
    cap = limits()
    output.mkdir(parents=True, exist_ok=False)
    began = datetime.now(timezone.utc).isoformat()
    wall, cpu = time.monotonic(), time.process_time()
    core = {"schema_version": "cartan-interface-analysis/1.0.0", "model_version": VERSION,
            "evidence_scope": "constructed_logical_model_only", "physical_authorization": "not_assessed",
            "cases": [], "predicate_checks": [], "exclusions": []}
    try:
        config = json.loads((HERE / "cases.json").read_text())
        require(config["schema_version"] == core["schema_version"] and config["model_version"] == VERSION and len(config["cases"]) <= 100, "Invalid frozen configuration")
        require(len({case["id"] for case in config["cases"]}) == len(config["cases"]), "Duplicate case identifiers")
        for case in config["cases"]:
            row = {"id": case["id"], "input": case, "status": "started"}
            core["cases"].append(row)
            write(output / "progress.json", core)  # Retain attempted input before evaluation.
            try:
                result = evaluate(case["action"], expand(case["reports"]), case.get("profile", "preliminary_vocabulary"), case.get("now", 0), case.get("epoch", 0))
            except ValueError as error:
                row.update(error=str(error), status="rejected")
                require(case.get("expected_error", "UNEXPECTED ERROR") in str(error), "Unexpected case rejection")
            else:
                row.update(result=result, status="evaluated")
                require("expected_error" not in case and result["status"] == case["expected"], "Unexpected case assessment")
                require(result["physical_authorization"] == "not_assessed", "Physical scope laundering")
        for w in worlds():
            for action in ("release_support", "energize", "disconnect", "remove_module"):
                result = evaluate(action, [], domain=[w])
                expected = "admissible" if reference(action, w) else "refuted"
                require(result["status"] == expected, "Predicate/reference disagreement")
                core["predicate_checks"].append({"world_id": world_id(w), "assignment": w, "action": action,
                                                  "expected": expected, "actual": result["status"]})
        require(len(core["predicate_checks"]) == 256, "Incomplete exhaustive check")
    except Exception as error:
        write(output / "progress.json", core)
        write(output / "failure.json", {"status": "failed_retained", "error": str(error)})
        raise
    write(output / "progress.json", core)
    write(output / "core.json", core)
    used = resource.getrusage(resource.RUSAGE_SELF)
    inputs = ["research/decisions/ADR-003.md", "research/block-3/protocol.md", "research/block-2/sources.md",
              "backend/interface_evidence/engine.py", "backend/interface_evidence/cases.json", "backend/interface_evidence/run_analysis.py",
              "backend/interface_evidence/test_engine.py"]
    summary = {"checks_passed": True, "cases": len(core["cases"]), "predicate_checks": len(core["predicate_checks"]),
        "expected_rejections": sum(r["status"] == "rejected" for r in core["cases"]),
        "assessment_counts": {status: sum(r.get("result", {}).get("status") == status for r in core["cases"])
                              for status in ("admissible", "refuted", "unresolved", "inconsistent")},
        "evidence_scope": "constructed_logical_model_only", "physical_authorization": "not_assessed",
        "core_sha256": hashlib.sha256(canonical(core)).hexdigest(),
        "input_hashes": [{"path": p, "sha256": sha(ROOT / p)} for p in inputs],
        "limits": cap, "started_at": began, "ended_at": datetime.now(timezone.utc).isoformat(),
        "evaluation_cpu_s": time.process_time()-cpu, "evaluation_wall_s": time.monotonic()-wall,
        "rss_high_water_bytes_at_sample": used.ru_maxrss if sys.platform == "darwin" else used.ru_maxrss*1024,
        "measurement_scope": "Imports and final summary/manifest export excluded; RSS sampled after core export",
        "python": platform.python_version(), "platform": platform.platform()}
    write(output / "summary.json", summary)
    require(sum(p.stat().st_size for p in output.iterdir()) < 10*1024*1024, "Output limit exceeded; records retained")
    write(output / "SHA256SUMS.json", {p.name: sha(p) for p in sorted(output.iterdir())})
    print(json.dumps({k: v for k, v in summary.items() if k != "input_hashes"}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    run(args.output)
