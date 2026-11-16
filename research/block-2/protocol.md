# Block 2 frozen exploratory protocol

Frozen before implementation/execution, 16 November 2026. Author/reviewer: this
research session; no independent engineering review. Authority: active operator
request to continue autonomously. [ADR 002](../decisions/ADR-002.md) and
[mathematics](mathematics.md) define assumptions and permissible conclusions.

Primary endpoint: no false singleton fact on any history allowed by the declared
bounded-error model; retain truth in every candidate prefix. Compare B0/C at every
accepted prefix, including decision-acquisition counts. The predicted result is
equality, not superiority. A disagreement is an implementation defect to preserve
and investigate, not a performance win. Do not tune cases after observing results.

Enumerate both truths for `k=0,1,2`, each at length `2k+1`, with every binary word
having at most `k` mismatches. This produces 42 primary histories, without a
probability measure. Both policies receive exactly the same unique, fresh reports
and error bound, with no truth access. Record all prefixes, candidate states,
decisions and first-decision counts, including histories that resolve early.
These are exhaustive cases in this finite domain, not held-out or physical data.

Also retain ambiguous balanced words of length `2k` as lower-bound witnesses.
Check two ideal B2 observations and a common-cause joint-channel counterexample.
The B2 ideal is an assumption sensitivity, not a validated sensor. B1 has only the
same-information lower bound; no human trial, response time or workload is fabricated.
N preserves the unobserved fact. A passive-interlock truth table checks conditional
action prevention only, not an actual mechanism or full service completion.

Known-bad controls: a repeated acquisition counted as new; more than the allowed
number of false reports; a shared stuck-high cause mistaken for independent
corroboration; zero-volume touching intervals mistaken for separation; stale,
future, missing and old-epoch reports; disagreement on a reused acquisition ID;
and an inconsistent history. Preserve rejected or unresolved outcomes. No physical
command or unsafe baseline trial is required.

Closed-box fixtures: disjoint, positive overlap, endpoint contact, shared edge,
point boxes, and a tiny rational gap. Require a contained witness whenever overlap
exists. A failed overlap optimization is not an impossibility proof. A nonempty
set of worlds agreeing on an action precondition can certify that precondition
without distinguishing all fault labels.

Electrical sensitivity: `v_max=1`, `v_limit=1/10`, `τ_max∈{1,2,4}` synthetic seconds,
`u_max∈{0,1/20,1/10}`, integer waiting grid `0…32`. Keep all nine results, including
no finite passive-wait certificate at the equal-floor boundary. No parameter is
calibrated. Test rational exponential inclusions against a separate 70-digit
Decimal evaluation on a fixed grid; that numerical comparison is corroboration,
while the alternating-series argument supplies the conditional bound.

One worker; 5 CPU seconds per invocation; requested 256 MiB address space (record
OS refusal); ≤100 primary histories, ≤32 events/history. At most 1000 small
analytic/unit assertions and nine bounded 33-point waiting searches. JSON <10 MiB,
reading scratch <250 MiB, no installations or services. Preserve every attempt and
stop for any truth elimination, false certificate, cap breach or unexplained B0/C
disagreement. Record operational failures separately. Retain one replay to check
deterministic core identity; it is not independent evidence.

Report safety of the **fact inference**, unresolved/inconsistent decisions,
valid-acquisition count and measured compute/memory separately. Physical retention
loss, energization, loads, recovery time, operator intervention, cost and mission
success are not measured by this study. Do not encode them as zeros. A physical
mapping, accepted error model and reviewed limits remain prerequisites to extension.
