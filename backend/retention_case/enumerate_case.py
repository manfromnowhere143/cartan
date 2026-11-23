"""SYN-RC-1: exhaustive finite verification only; no hardware or planner API."""
import hashlib
import json
from pathlib import Path
import resource

HERE = Path(__file__).resolve().parent
CHECKER_ID = "RC-enumeration/1.0.0"


def histories(cfg, interlock=False):
    """Forward event simulation; one bias and one seating due time per trace."""
    result = []
    for due in cfg["due_ticks"]:
        for bias in cfg["persistent_biases"]:
            drive, engaged, epoch = 0, False, 0
            trace = []
            for tick, command in enumerate(cfg["command_history"]):
                if tick == 1 and not interlock:
                    drive = 1
                if tick == cfg["interruption_tick"]:
                    engaged = due <= tick
                    if interlock:
                        drive = int(engaged)
                if tick == cfg["reset_tick"]:
                    epoch += 1
                # After the interrupt the delayed stage is arrested, not advanced.
                truth = {"drive": drive, "engaged": engaged, "retained": engaged,
                         "support_secured": True, "contact": "aligned",
                         "controller": cfg["controller_history"][tick], "epoch": epoch,
                         "source_isolation": "UNKNOWN", "measured_voltage": "UNMEASURED"}
                observation = {"tick": tick, "sampled_tick": tick, "received_tick": tick,
                               "epoch": epoch, "drive": drive + bias,
                               "proximity": "aligned", "support_secured": True,
                               "controller": truth["controller"], "command": command}
                trace.append({"truth": truth, "observation": observation})
            result.append({"id": f"due-{due}-bias-{bias}", "due": due,
                           "bias": bias, "trace": trace})
    return result


def consistent(cfg, traces, interlock=False):
    desired = cfg["interlock_drive_history" if interlock else "ordinary_drive_history"]
    return [t for t in traces if [r["observation"]["drive"] for r in t["trace"]] == desired]


def classify(states, action):
    if not states:
        return "inconsistent"
    allowed = [action != "attest_capture" or r for r in states]
    return "admissible" if all(allowed) else "refuted" if not any(allowed) else "unresolved"


def admit_delivery(packet, prior, current_epoch, now):
    if not 0 <= packet['sampled_tick'] <= packet['received_tick'] <= now:
        return 'invalid_time'
    same_acquisition = all(packet[k] == prior[k] for k in ('acquisition_id', 'sampled_tick', 'epoch', 'value'))
    if packet['acquisition_id'] == prior['acquisition_id'] and not same_acquisition:
        return 'conflicting_acquisition'
    if same_acquisition and packet['epoch'] != current_epoch:
        return 'old_epoch_duplicate_not_new_acquisition'
    return 'duplicate' if same_acquisition else 'new_acquisition'


def successors(states, action):
    """Returns observation classes or a terminal; never chooses from truth."""
    if action == "park":
        return "supported_abort", {}
    if action == "attest_capture":
        return "captured_supported", {}
    if action == "retry":
        return None, {"retry_done": (True,)}
    if action == "inspect":
        return None, {str(int(r)): (r,) for r in states}
    return None, {"ordinary_readback_unchanged": states}


def assess(cfg, states, ticks, direct=False, goal="either"):
    """Finite universal reach-avoid recurrence; holds are not terminal successes."""
    if not states or ticks <= 0:
        return []
    winning = []
    for action, cost in cfg["actions"].items():
        if action == "inspect" and not direct:
            continue
        if cost > ticks or classify(states, action) != "admissible":
            continue
        terminal, branches = successors(states, action)
        if terminal:
            success = goal == "either" or terminal == "captured_supported"
        else:
            success = all(assess(cfg, b, ticks-cost, direct, goal) for b in branches.values())
        if success:
            winning.append(action)
    return sorted(winning)


def fixed_baseline(states, commands, cfg):
    rows = []
    for initial in states:
        r, elapsed, terminal = initial, 0, None
        for action in commands:
            if terminal or classify((r,), action) != "admissible":
                raise ValueError("Invalid fixed baseline")
            elapsed += cfg["actions"][action]
            terminal, branches = successors((r,), action)
            if not terminal:
                if len(branches) != 1:
                    raise ValueError("Fixed baseline cannot branch on hidden truth")
                r = next(iter(branches.values()))[0]
        rows.append({"initial_retained": initial, "actions": commands,
                     "elapsed_ticks": elapsed, "terminal": terminal,
                     "support_secured": True, "release_permitted": False})
    return rows


def main():
    resource.setrlimit(resource.RLIMIT_CPU, (5, 5))
    cfg = json.loads((HERE / "fixture.json").read_text())
    if cfg["mode"] != "synthetic_fixture" or cfg["horizon_ticks"] != 3:
        raise ValueError("Only the frozen synthetic domain is supported")
    traces = histories(cfg)
    admitted = consistent(cfg, traces)
    states = tuple(sorted({t["trace"][-1]["truth"]["retained"] for t in admitted}))
    interlocked = consistent(cfg, histories(cfg, True), True)
    c01 = tuple(sorted({t["trace"][-1]["truth"]["retained"] for t in interlocked}))
    # These diagnostic relations are mathematical controls, not mechanism traces.
    marginal_relations = {"retained": [[b, b] for b in (0, 1)],
                          "unretained": [[b, 1-b] for b in (0, 1)]}
    common = sorted(set(map(tuple, marginal_relations["retained"])) &
                    set(map(tuple, marginal_relations["unretained"])))
    packet = {"acquisition_id": "drive-0", "sampled_tick": 0,
              "received_tick": 4, "epoch": 0, "value": 0}
    prior = dict(packet, received_tick=0)
    controls = {
        "C00": {"admitted_history_ids": [t["id"] for t in admitted],
                "remaining_retention": states,
                "action_status": {a: classify(states, a) for a in cfg["actions"] if a != "inspect"},
                "winning_first_actions": assess(cfg, states, 3)},
        "C01": {"admitted_history_ids": [t["id"] for t in interlocked],
                "remaining_retention": c01, "attest_capture": classify(c01, "attest_capture"),
                "winning_first_actions": assess(cfg, c01, 1)},
        "C02": {"packet": packet,
                "current_epoch": 1, "disposition": admit_delivery(packet, prior, 1, 4),
                "remaining_retention": states},
        "C03": {"relations": marginal_relations, "common_full_histories": common,
                "marginal_intersections": [[0, 1], [0, 1]],
                "inconsistent_action_status": classify((), "park"),
                "inconsistent_winning_first_actions": assess(cfg, (), 3)},
        "C04": {"supported_park": fixed_baseline(states, ["park"], cfg),
                "ordinary_retry": fixed_baseline(states, ["retry", "attest_capture"], cfg),
                "capture_only_winning_first_actions": assess(cfg, states, 3, goal="capture_only"),
                "algorithmic_advantage": "none_in_this_fixture"},
        "C05": {"observation_classes": {str(int(r)): {"remaining_retention": [r],
                  "attest_capture": classify((r,), "attest_capture")} for r in states},
                "winning_first_actions": assess(cfg, states, 3, direct=True)},
        "C06": {"deadline_ticks": 1, "remaining_retention": states,
                "winning_first_actions": assess(cfg, states, 1, direct=True),
                "scope": "complete finite domain only; not physical unrecoverability"}}
    result = {"schema_version": cfg["schema_version"], "scenario_id": cfg["scenario_id"],
              "checker_id": CHECKER_ID, "mode": cfg["mode"], "notice": cfg["notice"],
              "physical_authorization": "not_assessed", "histories": traces,
              "interlocked_histories": histories(cfg, True), "controls": controls,
              "source_hashes": {name: hashlib.sha256((HERE/name).read_bytes()).hexdigest()
                                for name in ("fixture.json", "enumerate_case.py", "check_case.py")}}
    print(json.dumps(result, sort_keys=True, indent=2))


if __name__ == "__main__":
    main()
