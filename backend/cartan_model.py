"""Abstract hybrid exchange kernel. No hardware, services or probability model."""
from dataclasses import asdict, dataclass, replace
from itertools import product
import math

VERSION = "abstract-exchange/0.1.0"
DOMAINS = {
    "host": ("open", "partial", "locked"),
    "support": ("secured", "released"),
    "connector": ("mated", "separated"),
    "source": ("connected", "isolated"),
    "contact": ("clear", "unexpected"),
}
ACTIONS = ("isolate", "wait", "secure", "unlock", "separate", "mate", "lock",
           "release_support", "energize", "hold")


@dataclass(frozen=True)
class State:
    host: str = "locked"
    support: str = "released"
    connector: str = "mated"
    source: str = "connected"
    energy_fraction: float = 1.0
    contact: str = "clear"

    def __post_init__(self):
        for key, allowed in DOMAINS.items():
            if getattr(self, key) not in allowed:
                raise ValueError(f"Invalid {key}")
        if type(self.energy_fraction) not in (float, int) or not math.isfinite(self.energy_fraction) or not 0 <= self.energy_fraction <= 1:
            raise ValueError("Invalid energy fraction")
        if self.connector == "separated" and self.host != "open":
            raise ValueError("Host retention cannot engage the separated cartridge")
        if self.source == "connected" and self.energy_fraction != 1:
            raise ValueError("Connected source has unit normalized energy in this model")


def check_parameters(dt=0, tau=2, threshold=0.05):
    if any(type(v) not in (int, float) or not math.isfinite(v) for v in (dt, tau, threshold)):
        raise ValueError("Parameters must be finite numbers")
    if not 0 <= dt <= 30 or tau <= 0 or not 0 <= threshold < 1:
        raise ValueError("Parameters outside local verification envelope")


def structural(x, action):
    """Mechanism feasibility only; deliberately not a physical safety oracle."""
    if action not in ACTIONS:
        return False
    if action in ("secure", "unlock", "lock"):
        return x.connector == "mated"
    if action == "separate":
        return x.connector == "mated" and x.host == "open"
    if action == "mate":
        return x.connector == "separated" and x.host == "open"
    return True


def transition(x, action, dt=0, tau=2, partial=False):
    check_parameters(dt, tau)
    if not structural(x, action):
        raise ValueError(f"Structurally impossible command: {action}")
    if partial and action not in ("lock", "unlock"):
        raise ValueError("Partial-actuation fault applies to lock/unlock only")
    if action == "isolate":
        x = replace(x, source="isolated")
    elif action == "secure":
        x = replace(x, support="secured")
    elif action == "unlock":
        x = replace(x, host="partial" if partial else "open")
    elif action == "separate":
        x = replace(x, connector="separated")
    elif action == "mate":
        x = replace(x, connector="mated")
    elif action == "lock":
        x = replace(x, host="partial" if partial else "locked")
    elif action == "release_support":
        x = replace(x, support="released")
    elif action == "energize":
        x = replace(x, source="connected", energy_fraction=1.0)
    if x.source == "isolated":
        x = replace(x, energy_fraction=x.energy_fraction * math.exp(-dt / tau))
    return x


def guard(action, candidates, threshold=0.05):
    """Receives a declared belief only. No access to actual plant or oracle."""
    check_parameters(threshold=threshold)
    if not candidates or action not in ACTIONS:
        return False
    def safe(s):
        if not structural(s, action):
            return False
        if action in ("isolate", "wait", "hold"):
            return True
        if s.contact != "clear":
            return False
        if action == "secure":
            return True
        if action == "release_support":
            return s.host == "locked"
        if action == "energize":
            return s.host == "locked" and s.connector == "mated"
        return s.support == "secured" and s.source == "isolated" and s.energy_fraction <= threshold
    return all(safe(s) for s in candidates)


def observe(x, t, epoch, *, false_host=None, stale=False, missing=False):
    """Ideal synthetic sensor adapter except explicitly injected report faults."""
    result = []
    for field, value in asdict(x).items():
        if field == "host" and false_host is not None:
            value = false_host
        result.append({
            "t_s": t, "sampled_at_s": max(0, t - 10) if stale else t,
            "received_at_s": t, "epoch": epoch, "source_id": "src-model-code",
            "variable": field,
            "reading": {"status": "missing" if missing else "known", "value": None if missing else value,
                        "unit": "1" if field == "energy_fraction" else "category", "basis": "computed"},
            "validity": "missing" if missing else "stale" if stale else "valid",
        })
    return result


def possible_states(reports, now, epoch, max_age=1, host_untrusted=False):
    """Set abstraction; uncertain energy endpoints suffice only for these monotone guards.

    This is a snapshot overapproximation, not temporal filtering. It does not infer
    sensor honesty. A false apparently-valid report can invalidate coverage.
    """
    values = {}
    for report in reports:
        if (report["validity"] == "valid" and report["reading"]["status"] == "known"
            and report["epoch"] == epoch and 0 <= now - report["sampled_at_s"] <= max_age
            and report["sampled_at_s"] <= report["received_at_s"] <= now):
            field, value = report["variable"], report["reading"]["value"]
            if field in values and values[field] != value:
                return []
            values[field] = value
    if host_untrusted:
        values.pop("host", None)
    keys = list(asdict(State()))
    options = [[values[k]] if k in values else ([0.0, 1.0] if k == "energy_fraction" else DOMAINS[k]) for k in keys]
    candidates = []
    for vals in product(*options):
        try:
            candidates.append(State(**dict(zip(keys, vals))))
        except ValueError:
            pass
    return candidates
