"""One-worker bounded local verification. Writes new directories only; no services."""
import argparse
from copy import deepcopy
from dataclasses import asdict
from datetime import datetime, timezone
import hashlib
import itertools
import json
import math
from pathlib import Path
import platform
import resource
import sys
import time

from cartan_model import State, VERSION, check_parameters, guard, observe, possible_states, structural, transition
from oracle import hazards_before_after, outcomes

ROOT = Path(__file__).resolve().parents[1]
CASES = ROOT / "backend/cases/verification-v1.json"
MAX_CASES, MAX_COMMANDS = 100, 32
HAZARDS = ("retention_loss", "unsafe_energization", "unsafe_connector_transition")
LIMITATIONS = [
    "MODEL VERIFICATION ONLY: no physical validation or controller comparison.",
    "Ideal synthetic sensors except named faults; not measurements or mission probabilities.",
    "Partial latch reachability, source isolation and persistent support require physical review.",
    "Snapshot candidate sets rely on sensor honesty; freshness is not correctness.",
    "Unknown energy is represented by extremal guard values, not an exhaustive continuous belief.",
    "Synthetic elapsed seconds omit action, communication and operator latency; not recovery performance.",
    "Loads, cost, mass, power and qualification are unmeasured; unrecoverability is unknown.",
    "Task completion is removal and return of one dummy, not functional replacement.",
]


def canonical(data):
    return json.dumps(data, sort_keys=True, separators=(",", ":"), allow_nan=False).encode()


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def utc():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def resource_limits():
    """Fail if CPU cap cannot be set; record OS refusal of address-space cap."""
    resource.setrlimit(resource.RLIMIT_CPU, (5, 5))
    result = {"workers": 1, "cpu_seconds_limit": 5,
              "address_space_requested_bytes": 256 * 1024 * 1024}
    try:
        resource.setrlimit(resource.RLIMIT_AS, (256 * 1024 * 1024, 256 * 1024 * 1024))
        result["address_space_limit_set"] = True
        result["address_space_note"] = "OS accepted limit; enforcement not stress-tested."
    except (ValueError, OSError) as error:
        result["address_space_limit_set"] = False
        result["address_space_note"] = str(error)
    return result


def replay(case, tau=2, threshold=.05):
    check_parameters(tau=tau, threshold=threshold)
    if not 0 < len(case["steps"]) <= MAX_COMMANDS:
        raise ValueError("Command count outside cap")
    x, t, epoch = State(**case["initial"]), 0.0, 0
    states = [x]
    truth = [{"t_s": t, "state": asdict(x)}]
    reports, beliefs, commands = [], [], []
    hazards = hazards_before_after(x, x, "hold", False, threshold)
    halted = False
    for step in case["steps"]:
        dt = step.get("dt", 0)
        check_parameters(dt, tau, threshold)
        if step.get("restart"):
            epoch += 1  # Does not change plant state or physical retention.
        obs = observe(x, t, epoch - int(step.get("old_epoch", False)),
                      false_host=step.get("false_host"), stale=step.get("stale", False),
                      missing=step.get("missing", False))
        if step.get("ack"):
            ack = deepcopy(obs[0])
            ack.update(variable="lock_ack", validity="stale")
            ack["reading"].update(value="received")
            obs.append(ack)
        if step.get("contradictory_host"):
            contrary = deepcopy(obs[0])
            contrary["reading"]["value"] = "open" if x.host != "open" else "locked"
            obs.append(contrary)
        reports.extend(obs)
        candidates = possible_states(obs, t, epoch)
        beliefs.append({"t_s": t, "candidates": [asdict(s) for s in candidates],
                        "status": "consistent" if candidates else "inconsistent"})
        action = step["action"]
        guarded = step.get("guarded", True)
        permitted = not guarded or guard(action, candidates, threshold)
        accepted = permitted and structural(x, action)
        reason = ("guard rejected supplied belief" if not permitted else
                  "structurally impossible command" if not accepted else
                  "abstract guard passed" if guarded else "intentional unguarded negative control")
        commands.append({"t_s": t, "name": action, "duration_s": dt,
                         "accepted": accepted, "reason": reason})
        before = x
        if accepted:
            x = transition(x, action, dt=dt, tau=tau, partial=step.get("partial", False))
            t += dt
        halted = not accepted
        # A rejected zero-duration command cannot mutate the plant. Scripted
        # rejections consume no time; this is deliberately not a latency model.
        events = hazards_before_after(before, x, action, accepted, threshold)
        hazards = {k: hazards[k] or events[k] for k in HAZARDS}
        states.append(x)
        truth.append({"t_s": t, "state": asdict(x)})
    return {"truth_series": truth, "observation_series": reports,
            "command_series": commands, "belief_series": beliefs,
            "outcomes": outcomes(states, hazards, t, halted, threshold)}


def assertions(case, record):
    expected = dict.fromkeys((*HAZARDS, "task_completed", "acceptable_completion", "safe_abort"), False)
    expected.update({k: v for k, v in case["expect"].items() if k != "accepted"})
    checks = {k: record["outcomes"][k]["value"] is value for k, value in expected.items()}
    checks["command_acceptance"] = [s["accepted"] for s in record["command_series"]] == case["expect"]["accepted"]
    checks["load_unmeasured"] = record["outcomes"]["exceeded_load_limits"]["status"] == "unmeasured"
    checks["unrecoverable_unknown"] = record["outcomes"]["unrecoverable"]["status"] == "unknown"
    checks["no_fabricated_operator"] = record["outcomes"]["interventions"]["value"] == 0
    return checks


def sensitivities():
    rows = []
    for tau, threshold, dt in itertools.product((1, 2, 4), (.01, .05, .1), (0, 5, 10)):
        initial = State(host="open", support="secured", source="isolated")
        x = transition(initial, "wait", dt=dt, tau=tau)
        analytic = math.exp(-dt / tau)
        permission = guard("separate", [x], threshold)
        rows.append({"tau_s": tau, "threshold": threshold, "wait_s": dt,
                     "energy_fraction": x.energy_fraction, "analytic_energy": analytic,
                     "guard_permits_separation": permission,
                     "check_passed": abs(x.energy_fraction - analytic) <= 1e-14 and permission == (analytic <= threshold)})
    return rows


def run(output):
    caps = resource_limits()
    start_wall, start_cpu = time.monotonic(), time.process_time()
    config = json.loads(CASES.read_text())
    if not 0 < len(config["cases"]) <= MAX_CASES or len({c["id"] for c in config["cases"]}) != len(config["cases"]):
        raise ValueError("Invalid case count or duplicate ID")
    output.mkdir(parents=True, exist_ok=False)
    input_paths = ["research/specification.md", "backend/cartan_model.py", "backend/oracle.py",
                   "backend/run_verification.py", "contracts/cartan/v1/schema.json",
                   "contracts/cartan/v1/fixture.json"]
    config_paths = ["research/protocol.md", "backend/cases/verification-v1.json"]
    hashes = lambda paths: [{"path": p, "sha256": sha(ROOT / p)} for p in paths]
    input_hashes, configuration_hashes = hashes(input_paths), hashes(config_paths)
    bundle = json.loads((ROOT / "contracts/cartan/v1/fixture.json").read_text())
    bundle["scenarios"], bundle["runs"] = [], []
    bundle["sources"].append({"id": "src-model-code", "title": "CARTAN deterministic abstract verification code",
        "uri": "backend/run_verification.py", "publication_date": {"status": "known", "value": "2026-11-16", "unit": "date", "basis": "computed"},
        "accessed_at": utc(), "reading_scope": "Executed locally; model-only evidence, hashes in each run"})
    attempts = []
    for case in config["cases"]:
        began = utc()
        try:
            record = replay(case, config["tau_s"], config["energy_threshold"])
            checks = assertions(case, record)
            attempts.append({"id": case["id"], "passed": all(checks.values()), "checks": checks})
            scenario = {"id": "scenario-" + case["id"], "model_version": VERSION,
                "physical_state_definition": "research/specification.md", "initial_state": asdict(State(**case["initial"])),
                "observation_definition": "Ideal synthetic field reports except named injections, with sampling time and epoch.",
                "controls": [s["action"] for s in case["steps"]], "fault_assumptions": [case["purpose"]],
                "safe_state_rules": ["Independent oracle evaluates retention, power and connector-event hazards."],
                "parameters": [{"name": n, "quantity": {"status": "known", "value": v, "unit": u, "basis": "assumed"}} for n,v,u in
                               [("tau", config["tau_s"], "s"), ("energy_threshold", config["energy_threshold"], "1")]],
                "source_refs": [{"source_id": "src-model-code", "location": "backend/cases/verification-v1.json#" + case["id"]}],
                "limitations": LIMITATIONS}
            bundle["scenarios"].append(scenario)
            bundle["runs"].append(dict(record, id="run-" + case["id"], scenario_id=scenario["id"], mode="simulation",
                schema_version="1.0.0", model_version=VERSION, controller_version="set-guard/0.1.0-scripted-verification",
                display_notice="SIMULATION — ABSTRACT MODEL ONLY; NO PHYSICAL VALIDATION", evidence_scope="model_only",
                input_hashes=input_hashes, configuration_hashes=configuration_hashes,
                seed={"status": "not_applicable", "value": None, "unit": "count", "basis": "computed"},
                started_at=began, ended_at=utc(), units={"time": "s", "energy": "1", "load": "N"}, exclusions=[],
                provenance=scenario["source_refs"], limitations=LIMITATIONS))
        except (ValueError, KeyError, TypeError) as error:
            attempts.append({"id": case["id"], "passed": False, "error": f"{type(error).__name__}: {error}"})
        # Preserve every attempt before continuing. No failed case is silently excluded.
        (output / "attempts.json").write_text(json.dumps(attempts, indent=2) + "\n")
    sensitivity = sensitivities()
    core = {"records": [{"id": r["id"], **{k: r[k] for k in ("truth_series", "observation_series", "command_series", "belief_series", "outcomes")}} for r in bundle["runs"]],
            "sensitivity": sensitivity}
    passed = all(a["passed"] for a in attempts) and all(r["check_passed"] for r in sensitivity)
    # Core excludes wall-clock/platform metadata but includes all modeled traces.
    for name, value in (("bundle.json", bundle), ("core.json", core), ("sensitivity.json", sensitivity)):
        (output / name).write_text(json.dumps(value, indent=2, allow_nan=False) + "\n")
    used = resource.getrusage(resource.RUSAGE_SELF)
    summary = {"verification_passed": passed, "scientific_validation": False,
        "comparison_executed": False, "cases_attempted": len(attempts), "cases_recorded": len(bundle["runs"]),
        "cases_passed": sum(a["passed"] for a in attempts), "sensitivity_points": len(sensitivity),
        "core_sha256": hashlib.sha256(canonical(core)).hexdigest(), "limits": caps,
        "wall_seconds": time.monotonic() - start_wall, "cpu_seconds": time.process_time() - start_cpu,
        "peak_rss_bytes": used.ru_maxrss if sys.platform == "darwin" else used.ru_maxrss * 1024,
        "platform": platform.platform(), "python": platform.python_version(),
        "outcome_scope": "three abstract hazards only; loads unmeasured; unrecoverability unknown",
        "inputs": input_hashes, "configuration": configuration_hashes}
    (output / "summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    manifest = {p.name: sha(p) for p in sorted(output.iterdir()) if p.is_file()}
    (output / "SHA256SUMS.json").write_text(json.dumps(manifest, indent=2) + "\n")
    if sum(p.stat().st_size for p in output.iterdir()) > 10 * 1024 * 1024:
        raise ValueError("Evidence exceeds 10 MiB cap; files retained for inspection")
    print(json.dumps(summary, indent=2))
    return 0 if passed else 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True, help="New empty output directory; never overwritten")
    args = parser.parse_args()
    sys.exit(run(args.output))
