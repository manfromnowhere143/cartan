"""Two conditional retention-fact estimators. No truth input and no actuators."""
from dataclasses import dataclass

VERSION = "recovery-evidence/0.1.0"


def budget_check(k):
    if k is not None and (type(k) is not int or not 0 <= k <= 2):
        raise ValueError("Exploratory error budget must be 0, 1, 2 or unknown")


def fact(candidates):
    values = set(candidates)
    if not values:
        return "inconsistent"
    if values == {0}:
        return "not_locked"
    if values == {1}:
        return "locked"
    return "unresolved"


@dataclass(frozen=True)
class Report:
    acquisition_id: str
    value: int | None
    sampled_at: int
    received_at: int
    epoch: int = 0
    source: str = "ordinary-sensor"
    validity: str = "valid"


class Admission:
    """Trusted IDs/timestamps/source are assumptions, not authenticated hardware."""
    def __init__(self, epoch=0):
        if type(epoch) is not int or epoch < 0:
            raise ValueError("Invalid epoch")
        self.epoch, self.seen = epoch, {}

    def accept(self, report, now):
        if type(now) is not int or any(type(v) is not int for v in (report.sampled_at, report.received_at, report.epoch)):
            return "invalid_time"
        if not 0 <= report.sampled_at <= report.received_at <= now:
            return "invalid_time"
        if report.epoch != self.epoch:
            return "old_or_unknown_epoch"
        if report.validity != "valid":
            return "invalid_or_missing"
        if now - report.sampled_at > 1:
            return "stale"
        if type(report.value) is not int or report.value not in (0, 1):
            return "invalid_value"
        if report.source != "ordinary-sensor" or type(report.acquisition_id) is not str or not report.acquisition_id:
            return "invalid_identity"
        identity = (report.value, report.sampled_at, report.epoch, report.source)
        if report.acquisition_id in self.seen:
            return "duplicate" if self.seen[report.acquisition_id] == identity else "conflicting_acquisition"
        if len(self.seen) >= 32:
            raise ValueError("Observation cap exceeded")
        self.seen[report.acquisition_id] = identity
        return "accepted"


class CountingB0:
    """Conventional bounded retry/read-and-count rule, not a full recovery FSM."""
    def __init__(self, k, epoch=0):
        budget_check(k)
        self.k, self.gate = k, Admission(epoch)
        self.zeros = self.ones = 0
        self.broken = False

    @property
    def candidates(self):
        if self.broken:
            return set()
        if self.k is None:
            return {0, 1}
        result = set()
        if self.ones <= self.k:
            result.add(0)
        if self.zeros <= self.k:
            result.add(1)
        return result

    def ingest(self, report, now):
        admission = self.gate.accept(report, now)
        if admission == "conflicting_acquisition":
            self.broken = True
        if admission == "accepted":
            if report.value == 0:
                self.zeros += 1
            else:
                self.ones += 1
        return admission, fact(self.candidates)

    def restart(self, epoch):
        if type(epoch) is not int or epoch <= self.gate.epoch:
            raise ValueError("Restart epoch must strictly increase")
        self.__init__(self.k, epoch)


class PossibleStateC:
    """Explicit truth/error-count propagation; does not call B0 or its counts."""
    def __init__(self, k, epoch=0):
        budget_check(k)
        self.k, self.gate = k, Admission(epoch)
        self.states = {(0, 0), (1, 0)}

    @property
    def candidates(self):
        return {b for b, _ in self.states}

    def ingest(self, report, now):
        admission = self.gate.accept(report, now)
        if admission == "conflicting_acquisition":
            self.states = set()
        if admission == "accepted" and self.k is not None:
            self.states = {(b, used + int(report.value != b)) for b, used in self.states
                           if used + int(report.value != b) <= self.k}
        return admission, fact(self.candidates)

    def restart(self, epoch):
        if type(epoch) is not int or epoch <= self.gate.epoch:
            raise ValueError("Restart epoch must strictly increase")
        self.__init__(self.k, epoch)


def all_required(preconditions):
    """Even a known retention fact alone is not authorization to release support."""
    required = {"retention", "support", "contact", "load", "circuit", "time"}
    return set(preconditions) == required and all(value is True for value in preconditions.values())
