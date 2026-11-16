"""Offline structural/semantic validation. This is not a science or safety check."""
import argparse
from copy import deepcopy
from datetime import datetime
import hashlib
import json
import math
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker

HERE = Path(__file__).resolve().parent
SCHEMA = json.loads((HERE / "schema.json").read_text())


def validate(data):
    Draft202012Validator.check_schema(SCHEMA)
    Draft202012Validator(SCHEMA, format_checker=FormatChecker()).validate(data)
    groups = ["sources", "components", "claims", "assets", "scenarios", "runs"]
    ids = [v["id"] for group in groups for v in data[group]]
    if len(ids) != len(set(ids)):
        raise ValueError("IDs must be unique across the bundle")
    sources = {v["id"] for v in data["sources"]}
    assets = {v["id"] for v in data["assets"]}
    components = {v["id"] for v in data["components"]}
    scenarios = {v["id"]: v for v in data["scenarios"]}

    def walk(v):
        if isinstance(v, float) and not math.isfinite(v):
            raise ValueError("Nonfinite number")
        if isinstance(v, dict):
            if "source_id" in v and v["source_id"] not in sources:
                raise ValueError("Unresolved source reference")
            for x in v.values():
                walk(x)
        elif isinstance(v, list):
            for x in v:
                walk(x)
    walk(data)
    for component in data["components"]:
        if component["geometry_asset_id"] not in assets:
            raise ValueError("Unresolved geometry asset")
        if any(r["target_id"] not in components for r in component["relationships"]):
            raise ValueError("Unresolved component relationship")
    for run in data["runs"]:
        scenario = scenarios.get(run["scenario_id"])
        if not scenario or scenario["model_version"] != run["model_version"]:
            raise ValueError("Scenario/model mismatch")
        if datetime.fromisoformat(run["ended_at"].replace("Z", "+00:00")) < datetime.fromisoformat(run["started_at"].replace("Z", "+00:00")):
            raise ValueError("Negative wall-clock duration")
        for key in ("truth_series", "observation_series", "command_series", "belief_series"):
            times = [v["t_s"] for v in run[key]]
            if times != sorted(times):
                raise ValueError("Nonmonotonic series")
        for obs in run["observation_series"]:
            if obs["sampled_at_s"] > obs["received_at_s"] or obs["received_at_s"] > obs["t_s"]:
                raise ValueError("Observation time inconsistency")
        for b in run["belief_series"]:
            if not b["candidates"] and b["status"] == "consistent":
                raise ValueError("Empty consistent belief")
        out = run["outcomes"]
        bools = set(out) - {"interventions", "elapsed_s"}
        for key, datum in out.items():
            if datum["status"] == "known":
                if key in bools and type(datum["value"]) is not bool:
                    raise ValueError("Outcome must be boolean")
                if key not in bools and (type(datum["value"]) not in (int, float) or datum["value"] < 0):
                    raise ValueError("Outcome must be nonnegative numeric")
                if key == "interventions" and type(datum["value"]) is not int:
                    raise ValueError("Interventions must be an integer")
        hazards = ["retention_loss", "unsafe_energization", "unsafe_connector_transition", "exceeded_load_limits"]
        hazard = any(out[x]["status"] == "known" and out[x]["value"] is True for x in hazards)
        accepted = out["acceptable_completion"]["value"] is True
        if accepted and (out["task_completed"]["value"] is not True or hazard):
            raise ValueError("Unsafe or incomplete run called acceptable")
        if out["safe_abort"]["value"] is True and hazard:
            raise ValueError("Hazardous run called safe abort")
        if out["elapsed_s"]["status"] == "known":
            if any(v["t_s"] > out["elapsed_s"]["value"] for key in ("truth_series", "observation_series", "command_series", "belief_series") for v in run[key]):
                raise ValueError("Trace exceeds declared elapsed time")
        if run["mode"] == "synthetic_fixture":
            if any(x["basis"] == "measured" for x in out.values()):
                raise ValueError("Synthetic fixture cannot carry measured outcomes")


def self_test(data):
    good = deepcopy(data)
    good["runs"][0]["outcomes"]["task_completed"].update(status="known", value=False)
    good["runs"][0]["outcomes"]["interventions"].update(status="known", value=0)
    validate(good)
    def launder_hazard(d):
        for key in ["retention_loss", "task_completed", "acceptable_completion"]:
            d["runs"][0]["outcomes"][key].update(status="known", value=True)
    mutations = [
        lambda d: d.update(schema_version="2.0.0"),
        lambda d: d["runs"][0].update(evidence_scope="physical_only"),
        lambda d: d["runs"][0].update(display_notice="Validated spacecraft"),
        lambda d: d["components"][0].update(geometry_asset_id="absent"),
        lambda d: d["components"][0].update(id=d["assets"][0]["id"]),
        lambda d: d["runs"][0]["outcomes"]["elapsed_s"].update(value=0),
        lambda d: d["runs"][0].update(model_version="wrong"),
        lambda d: d["runs"][0]["outcomes"]["task_completed"].update(status="known", value=1),
        lambda d: d["runs"][0]["outcomes"]["task_completed"].update(basis="measured"),
        lambda d: d["claims"][0]["source_refs"][0].update(source_id="absent"),
        lambda d: d["runs"][0]["belief_series"][0].update(candidates=[], status="consistent"),
        lambda d: d["runs"][0]["outcomes"]["interventions"].update(status="known", value=-1),
        lambda d: d["runs"][0]["truth_series"][0]["state"].update(energy_fraction=float("nan")),
        launder_hazard,
        lambda d: d["runs"][0]["observation_series"][0].update(sampled_at_s=2),
        lambda d: d["runs"][0].update(ended_at="2026-11-15T00:00:00Z"),
    ]
    for index, mutation in enumerate(mutations):
        bad = deepcopy(data)
        mutation(bad)
        try:
            validate(bad)
        except (ValueError, __import__("jsonschema").ValidationError):
            continue
        raise AssertionError(f"Negative control {index} was accepted")
    return len(mutations)


def check_manifest():
    manifest = json.loads((HERE / "SHA256SUMS.json").read_text())
    actual = {p.name for p in HERE.iterdir() if p.is_file() and p.name != "SHA256SUMS.json"}
    if actual != set(manifest):
        raise ValueError("Contract file set drift")
    for name, digest in manifest.items():
        if hashlib.sha256((HERE / name).read_bytes()).hexdigest() != digest:
            raise ValueError(f"Contract hash drift: {name}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("bundle", type=Path)
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--manifest", action="store_true")
    args = parser.parse_args()
    data = json.loads(args.bundle.read_text())
    validate(data)
    count = self_test(data) if args.self_test else 0
    if args.manifest:
        check_manifest()
    print(json.dumps({"valid": True, "negative_controls_rejected": count, "scientific_validation": False}))
