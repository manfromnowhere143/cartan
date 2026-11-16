"""Logical interface evidence analysis. No hardware adapter or physical verdict."""
from copy import deepcopy
from itertools import product
import math

VERSION = "interface-evidence/0.1.0"
FIELDS = ("retained", "support_secured", "contacts_made", "controller_on",
          "source_isolated", "voltage_below_limit")
REQUIREMENTS = {
    "release_support": {"retained": True},
    "energize": {"retained": True, "contacts_made": True},
    "disconnect": {"retained": True, "support_secured": True, "controller_on": True,
                   "source_isolated": True, "voltage_below_limit": True},
    "remove_module": {"retained": False, "support_secured": True, "contacts_made": False,
                      "source_isolated": True, "voltage_below_limit": True},
}
VOCABULARY = {"receipt_ack", "processed_ack", "locking_ring_position", "motor_position",
              "bus_voltage", "controller_power", "controller_state"} | set(FIELDS)
STATUSES = {"known", "unknown", "missing", "unmeasured", "not_applicable", "explicit_null", "invalid"}
REPORT_FIELDS = {"id", "quantity", "status", "value", "unit", "source", "sampled_at", "received_at", "epoch", "mode"}


def worlds():
    return [dict(zip(FIELDS, bits)) for bits in product((False, True), repeat=len(FIELDS))]


def world_id(world):
    return "w-" + "".join("1" if world[name] else "0" for name in FIELDS)


def validate_report(report):
    if not isinstance(report, dict) or set(report) != REPORT_FIELDS:
        raise ValueError("Report fields do not match the declared research format")
    if report["mode"] != "synthetic_fixture":
        raise ValueError("Only constructed reports are supported; physical mode is not admitted")
    if type(report["quantity"]) is not str or type(report["status"]) is not str or report["quantity"] not in VOCABULARY or report["status"] not in STATUSES:
        raise ValueError("Unknown report quantity or status")
    if any(type(report[k]) is not str or not report[k] for k in ("id", "source", "unit")):
        raise ValueError("Report identity/unit required")
    if any(type(report[k]) is not int or report[k] < 0 for k in ("sampled_at", "received_at", "epoch")):
        raise ValueError("Times and epoch must be nonnegative integer synthetic ticks")
    value = report["value"]
    if report["status"] == "known":
        if value is None or type(value) not in (bool, int, float, str):
            raise ValueError("Known value must be a nonnull scalar")
        if type(value) is float and not math.isfinite(value):
            raise ValueError("Nonfinite report")
    elif value is not None:
        raise ValueError("Unknown/missing/null states require a null value")


def evaluate(action, reports, profile="preliminary_vocabulary", now=0, epoch=0, domain=None):
    if type(action) is not str or action not in REQUIREMENTS or profile not in ("preliminary_vocabulary", "synthetic_direct"):
        raise ValueError("Unsupported action or interpretation profile")
    if type(now) is not int or now < 0 or type(epoch) is not int or epoch < 0:
        raise ValueError("Invalid query time or epoch")
    if not isinstance(reports, list) or len(reports) > 32:
        raise ValueError("Report cap exceeded or invalid report container")
    remaining = deepcopy(worlds() if domain is None else domain)
    if not isinstance(remaining, list) or len(remaining) > 64:
        raise ValueError("World cap exceeded or invalid domain")
    for world in remaining:
        if not isinstance(world, dict) or set(world) != set(FIELDS) or any(type(v) is not bool for v in world.values()):
            raise ValueError("Each world must assign all six Boolean propositions")
    if len({world_id(w) for w in remaining}) != len(remaining):
        raise ValueError("Duplicate logical worlds")
    initial_count = len(remaining)
    seen, interpreted = {}, []
    accepted_ids = set()
    identity_conflict = False
    for report in reports:
        validate_report(report)
        effect = None
        if profile == "synthetic_direct" and report["quantity"] in FIELDS and report["status"] == "known" and type(report["value"]) is not bool:
            raise ValueError("Direct logical proposition requires a Boolean, not numeric zero/one")
        # Identity is checked even for reports excluded by freshness/status gates.
        # Type participates because Python otherwise equates True and numeric 1.
        identity = tuple((k, type(report[k]).__name__, report[k]) for k in sorted(REPORT_FIELDS - {"received_at"}))
        conflict = report["id"] in seen and seen[report["id"]] != identity
        duplicate = report["id"] in accepted_ids and not conflict
        seen.setdefault(report["id"], identity)
        if conflict:
            reason = "conflicting_acquisition"
            identity_conflict = True
        elif not report["sampled_at"] <= report["received_at"] <= now:
            reason = "invalid_time_order"
        elif report["epoch"] != epoch:
            reason = "old_or_unknown_epoch"
        elif now - report["sampled_at"] > 1:
            reason = "stale"
        elif report["status"] != "known":
            reason = "no_known_observation"
        elif duplicate:
            reason = "duplicate"
        else:
            accepted_ids.add(report["id"])
            if report["quantity"] in ("receipt_ack", "processed_ack"):
                reason = "command_report_only"
            elif profile == "synthetic_direct" and report["quantity"] in FIELDS:
                effect = {report["quantity"]: report["value"]}
                remaining = [w for w in remaining if w[report["quantity"]] is report["value"]]
                reason = "assumed_synthetic_binding"
            else:
                reason = "observation_retained_physical_mapping_unverified"
        interpreted.append({"report": deepcopy(report), "disposition": reason, "constraint": effect})
    if identity_conflict:
        remaining = []
    requirements = REQUIREMENTS[action]
    yes = [w for w in remaining if all(w[key] is value for key, value in requirements.items())]
    no = [w for w in remaining if any(w[key] is not value for key, value in requirements.items())]
    status = "inconsistent" if not remaining else "admissible" if not no else "refuted" if not yes else "unresolved"
    def witness(items):
        return None if not items else {"id": world_id(items[0]), "assignment": items[0]}
    return {"model_version": VERSION, "action": action, "requirements": deepcopy(requirements),
        "status": status, "profile": profile, "now_tick": now, "epoch": epoch,
        "initial_world_count": initial_count, "remaining_worlds": remaining,
        "reports": interpreted, "supporting_witness": witness(yes), "contradicting_witness": witness(no),
        "evidence_scope": "constructed_logical_model_only", "physical_authorization": "not_assessed",
        "assumptions": ["Logical worlds need not all be mechanically reachable.",
            "The true situation must be covered by the declared world set for a universal conclusion to apply.",
            "Accepted acquisition identity/time and proposition stability are assumed."] +
            (["Direct Boolean bindings are synthetic and assumed fault-free, not calibrated observations."] if profile == "synthetic_direct" else []),
        "limitations": ["No physical calibration, hardware command, actual isolation proof or qualified load path.",
                        "Declared command predicates omit mechanism-specific loads, geometry, thermal and contact limits."]}
