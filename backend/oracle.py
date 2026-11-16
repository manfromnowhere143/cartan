"""Truth-based outcome scoring, isolated from controller guards and observations."""


def hazards_before_after(before, after, action, accepted, threshold):
    # Do not call the controller guard or use its acceptance as a safety result.
    retained = after.host == "locked" or after.support == "secured"
    return {
        "retention_loss": not retained,
        "unsafe_energization": after.source == "connected" and
            (after.host != "locked" or after.connector != "mated"),
        "unsafe_connector_transition": accepted and action in ("mate", "separate") and
            (before.source != "isolated" or before.energy_fraction > threshold),
    }


def outcomes(states, hazards, elapsed, halted, threshold):
    x = states[-1]
    completed = (any(s.connector == "separated" for s in states) and
                 x.host == "locked" and x.support == "released" and
                 x.connector == "mated" and x.source == "connected")
    safe_abort = (halted and not any(hazards.values()) and
                  x.source == "isolated" and x.energy_fraction <= threshold and
                  (x.host == "locked" or x.support == "secured") and x.contact == "clear")
    known = dict(hazards, task_completed=completed,
                 acceptable_completion=completed and not any(hazards.values()),
                 safe_abort=safe_abort, interventions=0, elapsed_s=elapsed)
    data = {k: {"status": "known", "value": v, "unit": "s" if k == "elapsed_s" else "count" if k == "interventions" else "category", "basis": "computed"} for k,v in known.items()}
    data["exceeded_load_limits"] = {"status": "unmeasured", "value": None, "unit": "category", "basis": "unknown"}
    data["unrecoverable"] = {"status": "unknown", "value": None, "unit": "category", "basis": "unknown"}
    return data
