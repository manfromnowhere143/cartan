# Protocol V1 local verification and later comparison

Frozen before code execution on 16 November 2026. Owner/reviewer: this research
session only. This is a desk review, not independent engineering or safety review.
Authority: active user request for safe bounded work after architecture decisions.
Read [ADR 001](../../../research/decisions/ADR-001.md) and [the model specification](specification.md).

## Stage V executed scope

Verify the abstract model and static interchange, using deterministic cases. Do
not run a trained-operator study, fit sensor probabilities or estimate physical
failure rates. The implemented candidate is a transparent guard over a supplied
set of possible states, not a novel planner. Baseline comparisons below are the
next experimental design; they are not silently represented by verification tests.

Predeclared cases: nominal remove/return; impossible separation before unlock;
isolated source with residual energy; deliberate unsafe energization; deliberate
retention loss; false latch report; stale ACK; communication loss; restart;
partial capture; unexpected contact. Start with each fault alone. A false latch
report plus partial capture is a clearly labeled adversarial combination testing
the observer/oracle boundary, not a frequency-weighted mission scenario.

Verification acceptance: nominal completion with no defined oracle hazard;
impossible transition rejected without plant mutation; all deliberate hazard
controls detected; false/stale/missing reports do not overwrite truth; restart
invalidates old evidence; unknown/empty beliefs do not permit progress; identical
inputs reproduce identical core records; schema and semantic negative controls
reject evidence laundering and inconsistent outcomes. Load-limit and
unrecoverability outcomes stay unmeasured/unknown. Any missed hazard or truth leak
stops the check and is retained as a defect. No exclusions; all attempts recorded.

Toy discharge sensitivities: tau ∈ {1, 2, 4} synthetic seconds, energy threshold
∈ {0.01, 0.05, 0.10} of hypothetical reference energy; wait ∈ {0, 5, 10} seconds.
These 27 points test monotonicity and boundaries, not physical safety margins or
mission rates. Analytic exponential decay is the reference for the numerical
flow. Do not choose a winner from this grid.

Resource limit: one worker, no installs or server, at most 100 runs × 32 commands,
5 CPU seconds per invocation and 256 MiB requested address space where supported.
Stop on exceeded cap; record unsupported OS enforcement instead of pretending it
exists. Retain small JSON outcomes and hashes; no paid/cloud execution.

## Stage E proposed comparative experiment

| Comparator | Required competence and information | Fairness and cost |
|---|---|---|
| B0 Engineered state machine | Freshness/epoch checks, state verification, finite retries, documented restart, safe hold/abort; usual latch/energy/support sensing and actual interlocks | All ordinary observations, safe diagnostics and history available to C also available to B0; tune both before holdout |
| B1 Trained operator-assisted recovery | Same sensing/commands plus the stated video if provided equally; documented training, procedure and communication availability | Human test not performed; record intervention count, response latency, workload and delay. A script is only a proxy |
| B2 Additional sensor or passive interlock | B0 plus independent latch/energy measurement, reviewed passive prevention, or removable diagnostic tooling | Separate system tradeoff; charge sensor, harness, mass, power, calibration, software, integration and qualification; do not credit perfect independence without evidence |
| C Explicit possible-state recovery | Same observation/action history as B0; safe action must hold for all retained states | B0 may encode the same logic. If behavior matches, there is no algorithm benefit |
| N Null action | Retain support, maintain reviewed isolation, wait/abort within hold limits | May preserve safety while failing service completion; include its downtime and resource cost |

Freeze real interface revision, circuit, load/energy limits, uncertainty model,
fault reachability and measurement independence first. Develop on single faults.
Future held-out cases should vary interruption phase and sensor common causes
without changing comparators after inspection. Held-out evaluation has **not**
occurred here. All current cases are known verification fixtures, not held-out data.

For a mission-backed protocol, predefine maximum unacceptable-event rate/severity,
minimum useful change in recovery time/interventions, statistical uncertainty,
hardware population, repetitions/randomization, exclusions and stopping rules with
the owner. Those numbers are currently unknown. Do not manufacture a confirmatory
sample size. Count completion, safe abort, retention loss, unsafe energization,
energized make/break, exceeded loads and unrecoverability separately. A run may
complete and still fail safety. Report every attempt and each denominator; no
single blended success score. Zero observed failures is not zero risk.

## Decision and economics rules

If B0 or N meets the actual requirement, narrow/stop the extra-controller branch.
If B2 meets it at lower lifecycle burden, prefer B2. If sensor dependence or
unreachable modeled states explains a gain, invalidate that comparison. If no
owner requirement exists, continue only inexpensive specification/observability
work; do not commit to a spacecraft product. No catastrophic baseline failure is
required. A useful improvement must preserve the accepted safety level.

Cost comparison should retain mass kg, average/peak power W, volume m³, recurring
hardware cost, integration/calibration/qualification labor hours, servicing and
replacement deployment, downtime and residual asset life. All are unmeasured here.
Use ranges only when sourced; unknown is not zero. Vary launch cost on both the
replacement and servicing sides. No TAM or expected-risk dollar value is calculated
without defensible mission data and probability assumptions.
