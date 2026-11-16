"""Conditional observation calculations. No physical clearance or hardware I/O."""
from collections import deque
from copy import deepcopy
from fractions import Fraction
from itertools import product
import re

VERSION = "physical-observation/0.1.0"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def number(value):
    require(type(value) is str and len(value) <= 32 and
            re.fullmatch(r"[+-]?\d+(?:/\d+|\.\d+)?", value) is not None,
            "Expected bounded-length rational string")
    try:
        return Fraction(value)
    except (ValueError, ZeroDivisionError) as error:
        raise ValueError("Invalid rational") from error


def interval(value):
    require(type(value) is list and len(value) == 2, "Expected two interval endpoints")
    lo, hi = map(number, value)
    require(lo <= hi, "Reversed interval")
    return lo, hi


def assessment(lo, hi, limit):
    if -limit <= lo <= hi <= limit:
        return "supported"
    if lo > limit or hi < -limit:
        return "refuted"
    return "unresolved"


def record(kind, data):
    return {"model_version": VERSION, "kind": kind, "input": deepcopy(data),
            "scope": "conditional_model_with_constructed_inputs",
            "physical_authorization": "not_assessed"}


def voltage(data):
    require(data["mode"] == "synthetic_fixture", "Only constructed inputs admitted")
    report, model, query = data["report"], data["model"], data["query"]
    output = record("terminal_voltage", data)
    output.update(status="unresolved", interval_V=None, reason=None,
                  source_isolation="not_assessed", stored_energy="not_assessed")
    for value in (report["epoch"], query["epoch"], model["epoch"]):
        require(type(value) is int and value >= 0, "Invalid epoch")
    for item in (report["point"], model["point"], query["point"], report["acquisition_id"], report["source"]):
        require(type(item) is str and 0 < len(item) <= 128, "Invalid observation identity")
    require(report["status"] in ("known", "unknown", "missing", "unmeasured", "explicit_null", "invalid"), "Unknown observation status")
    require(model["kind"] in ("hard_bound", "coverage", "unknown"), "Unknown uncertainty kind")
    require(model["fault"] in ("bounded", "arbitrary", "unknown"), "Unknown fault model")
    require(model["basis"] == "synthetic_assumption", "Unreviewed physical calibration is not admitted")
    low_t, high_t = interval(report["sampled_s"])
    received, now = number(report["received_s"]), number(query["time_s"])
    require(0 <= low_t <= high_t <= received <= now, "Invalid time order")
    limit, max_age = number(query["limit_V"]), number(model["max_age_s"])
    require(limit >= 0 and max_age >= 0, "Negative limit or maximum age")
    age = now-low_t
    output["maximum_age_s"] = str(age)
    output["assumptions"] = ["Sensor relation and rate envelope cover the query interval.",
        "Gain, bias and error bounds are assumed, not calibrated.",
        "No unmodeled switching, saturation or shared failure invalidates the bounds."]
    if report["status"] != "known":
        require(report["value_V"] is None, "Unknown report must retain null value")
        output["reason"] = "no_known_observation"
        return output
    y_lo, y_hi = interval(report["value_V"])
    reason = None
    if report["unit"] != "V":
        reason = "wrong_unit"
    elif not report["point"] == model["point"] == query["point"]:
        reason = "measurement_point_mismatch"
    elif not report["epoch"] == model["epoch"] == query["epoch"]:
        reason = "epoch_mismatch"
    elif age > max_age:
        reason = "stale"
    elif model["kind"] != "hard_bound":
        reason = "coverage_is_not_a_hard_bound"
    elif model["fault"] != "bounded":
        reason = "unbounded_fault_possible"
    elif any(model[k] is None for k in ("gain", "bias_V", "error_V", "rate_V_per_s")):
        reason = "missing_bound"
    if reason:
        output["reason"] = reason
        return output
    g_lo, g_hi = interval(model["gain"])
    b_lo, b_hi = interval(model["bias_V"])
    error, rate = number(model["error_V"]), number(model["rate_V_per_s"])
    require(g_lo > 0, "Gain interval must be strictly positive")
    require(error >= 0 and rate >= 0, "Negative error or rate bound")
    numerators = (y_lo-b_hi-error, y_hi-b_lo+error)
    candidates = [n/g for n, g in product(numerators, (g_lo, g_hi))]
    lo, hi = min(candidates)-rate*age, max(candidates)+rate*age
    output.update(status=assessment(lo, hi, limit), interval_V=[str(lo), str(hi)],
                  reason="conditional_inverse_and_time_enclosure")
    return output


def validate_graph(data):
    require(data["mode"] == "synthetic_fixture", "Only constructed inputs admitted")
    nodes, sources, edges = data["nodes"], data["sources"], data["edges"]
    require(type(nodes) is list and 0 < len(nodes) <= 32 and
            all(type(n) is str and 0 < len(n) <= 64 for n in nodes) and
            len(set(nodes)) == len(nodes), "Invalid graph nodes")
    require(type(sources) is list and len(sources) <= 32 and
            all(type(s) is str and s in nodes for s in sources) and
            len(set(sources)) == len(sources), "Invalid source inventory")
    require(data["target"] in nodes, "Unknown target")
    require(type(data["inventory_complete"]) is bool or data["inventory_complete"] is None,
            "Invalid inventory coverage tag")
    require(type(edges) is list and len(edges) <= 16, "Edge cap exceeded")
    ids, uncertain = set(), 0
    for edge in edges:
        require(set(edge) == {"id", "a", "b", "closed_states"}, "Invalid edge fields")
        require(type(edge["id"]) is str and edge["id"] and edge["id"] not in ids, "Duplicate or invalid edge ID")
        ids.add(edge["id"])
        require(edge["a"] in nodes and edge["b"] in nodes and edge["a"] != edge["b"], "Invalid edge endpoint")
        states = edge["closed_states"]
        require(type(states) is list and 1 <= len(states) <= 2 and
                all(type(s) is bool for s in states) and len(set(states)) == len(states), "Invalid edge-state domain")
        uncertain += len(states) == 2
    require(uncertain <= 8, "Topology assignment cap exceeded")


def path_to_source(nodes, sources, target, edges, assignment):
    adjacency = {n: [] for n in nodes}
    for edge in edges:
        if assignment[edge["id"]]:
            adjacency[edge["a"]].append(edge["b"])
            adjacency[edge["b"]].append(edge["a"])
    queue = deque([[source] for source in sources])
    seen = set(sources)
    while queue:
        path = queue.popleft()
        if path[-1] == target:
            return path
        for node in adjacency[path[-1]]:
            if node not in seen:
                seen.add(node)
                queue.append(path+[node])
    return None


def topology(data):
    validate_graph(data)
    output = record("source_connectivity", data)
    edges = data["edges"]
    worlds = []
    for states in product(*(edge["closed_states"] for edge in edges)):
        assignment = dict(zip((edge["id"] for edge in edges), states))
        path = path_to_source(data["nodes"], data["sources"], data["target"], edges, assignment)
        worlds.append({"assignment": assignment, "source_path": path, "isolated": path is None})
    isolated = [w for w in worlds if w["isolated"]]
    connected = [w for w in worlds if not w["isolated"]]
    status = "supported" if not connected else "refuted" if not isolated else "unresolved"
    reason = "conditional_connectivity_enumeration"
    if not data["inventory_complete"] or not data["sources"]:
        status, reason = "unresolved", "source_or_path_inventory_incomplete"
    output.update(status=status, reason=reason, worlds=worlds,
                  isolated_witness=isolated[0] if isolated else None,
                  connected_witness=connected[0] if connected else None,
                  voltage_limit="not_assessed", stored_energy="not_assessed",
                  assumptions=["All relevant sources and conductive paths are declared.",
                               "Edge-state alternatives cover the physical topology.",
                               "No omitted leakage, parasitic or breakdown path bypasses an open edge."])
    return output
