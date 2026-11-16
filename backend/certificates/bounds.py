"""Exact rational boxes and conditional RC bounds. No numerical safety tolerance."""
from fractions import Fraction


def rational(value):
    if isinstance(value, Fraction):
        return value
    if type(value) is int or (type(value) is str and len(value) <= 100):
        return Fraction(value)
    raise ValueError("Use exact integers, fractions or bounded rational strings")


def box(values):
    result = tuple((rational(a), rational(b)) for a, b in values)
    if not 1 <= len(result) <= 3 or any(a > b for a, b in result):
        raise ValueError("Invalid closed box")
    return result


def intersection(left, right):
    left, right = box(left), box(right)
    if len(left) != len(right):
        raise ValueError("Dimension mismatch")
    overlap = tuple((max(a, c), min(b, d)) for (a, b), (c, d) in zip(left, right))
    if any(a > b for a, b in overlap):
        return {"disjoint": True, "volume": Fraction(0), "witness": None}
    volume = Fraction(1)
    for lo, hi in overlap:
        volume *= hi - lo
    return {"disjoint": False, "volume": volume, "witness": tuple(lo for lo, _ in overlap)}


def exp_negative_bounds(x):
    x = rational(x)
    if not 0 <= x <= 32:
        raise ValueError("Argument outside bounded verification range")
    if x == 0:
        return Fraction(1), Fraction(1)
    r, squarings = x, 0
    while r > 1:
        r /= 2
        squarings += 1
    term = total = Fraction(1)
    for n in range(1, 14):
        term *= -r / n
        total += term
        if n == 12:
            upper = total
    lower = total
    for _ in range(squarings):
        lower, upper = lower * lower, upper * upper
    return lower, upper


def voltage_upper(t, tau_max, floor_max, initial_max=1):
    t, tau, floor, initial = map(rational, (t, tau_max, floor_max, initial_max))
    if not 0 <= t <= 32 or not 1 <= tau <= 4 or not 0 <= floor <= initial <= 1:
        raise ValueError("Outside declared scalar electrical envelope")
    _, decay_upper = exp_negative_bounds(t / tau)
    return floor + (initial - floor) * decay_upper


def waiting_certificate(tau_max, floor_max, limit="1/10", initial_max=1):
    tau, floor, limit, initial = map(rational, (tau_max, floor_max, limit, initial_max))
    voltage_upper(0, tau, floor, initial)  # Validate before any terminal branch.
    if not 0 < limit < initial:
        raise ValueError("Require a positive limit below the initial upper bound")
    if floor >= limit:
        return {"status": "no_finite_passive_wait_certificate", "wait_s": None,
                "reason": "An allowed worst-case constant-floor trajectory never reaches the limit.", "search": []}
    search = []
    for t in range(33):
        upper = voltage_upper(t, tau, floor, initial)
        search.append({"t_s": t, "upper": str(upper), "condition_established": upper <= limit})
        if upper <= limit:
            return {"status": "conditional_bound", "wait_s": t, "search": search}
    return {"status": "unresolved_within_grid", "wait_s": None, "search": search}
