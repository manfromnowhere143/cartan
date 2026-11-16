# Interface evidence analysis specification and protocol

Version `interface-evidence/0.1.0`. Frozen 16 November 2026 before execution.
Author/reviewer: this research session; no independent engineering review.

## Logical domain

Six independent Boolean propositions define 64 constructed worlds:
`retained`, `support_secured`, `contacts_made`, `controller_on`, `source_isolated`,
`voltage_below_limit`. Independence here means no unstated logical implications;
it does **not** mean physical/statistical sensor independence. Not every assignment
has demonstrated mechanical reachability. Retaining extra worlds is conservative
for a universal precondition check but cannot establish real-world coverage.

`retained` denotes the required load-path predicate, not merely encoder position.
`voltage_below_limit` presupposes a defined measurement point, uncertainty and
accepted limit, none established physically here. All inputs are constructed.

| Proposed action | Declared required facts |
|---|---|
| release_support | retained |
| energize | retained, contacts_made |
| disconnect | retained, support_secured, controller_on, source_isolated, voltage_below_limit |
| remove_module | not retained, support_secured, not contacts_made, source_isolated, voltage_below_limit |

These are deliberately incomplete physical preconditions. Contact force, loads,
geometry, thermal state and mechanism-specific sequencing remain unmodeled. The
evaluator never issues a command or supplies physical authorization. A separate
simulation can consume such a logical result only with an explicit scoped adapter.

For remaining worlds `W` and predicate `P`, return:
`inconsistent` if `W=∅`; `admissible` if every world satisfies `P`; `refuted` if
none satisfies `P`; otherwise `unresolved`. Retain one satisfying and one violating
witness where present. Different worlds may agree on an action without identifying
every physical variable. A witness is a logical assignment, not a reproduced fault.

## Observation interpretation

Reports contain ID, quantity, tagged status/value, unit, source, sampled/received
time, epoch and mode. Mode must be `synthetic_fixture` in this study. Times are
integer synthetic ticks; accepted acquisition age is at most one tick. Reject
future, stale, old-epoch, invalid and missing observations. Repeated acquisition
IDs add no evidence; conflicting reuse is inconsistent. Unknown/missing/null
remain distinct from known zero or false.

Pre-execution clarification: “reject” here excludes a report from inference and
retains its disposition; it does not reject the entire query. Physical mode,
unknown profiles and malformed direct Boolean facts reject the input. Acquisition
identity consistency is checked even for excluded reports. A later valid delivery
is not suppressed by an earlier invalid delivery of the same acquisition.

The `preliminary_vocabulary` profile retains observed values but does not bind
physical predicates. It does not decode CAN bytes or validate a current ICD.
`receipt_ack` and `processed_ack` are command-report quantities under every profile.
`locking_ring_position` is mechanism telemetry, not proof of a qualified load path.
`controller_power` is not bus isolation; a voltage report is not isolation proof.

Only `synthetic_direct` maps explicitly named Boolean propositions to constructed
worlds. That binding is assumed fault-free for software verification, never
physically validated. Every narrowed result must carry this assumption. Unsupported
bindings or physical-test inputs fail visibly, rather than silently changing scope.

## Frozen cases and checks

Retain: no observations; receipt ACK; processed ACK; zero-voltage report;
controller-off report; ring-position report; assumed retention; assumed disconnect
preconditions; a refuted remove; conflicting retention; stale retention; old epoch;
duplicate acquisition; conflicting acquisition identity; missing retention; known
false; and known zero. Add controls rejecting physical mode, bad time ordering,
unknown binding and non-Boolean direct facts.

Check 64 complete assignments for each of four actions against a separate reference
predicate. The evaluator/reference must agree on all 256 classifications. Also
verify the mixed-world and empty-world status rules, retained witnesses and exact
provenance. No exclusions or held-out claims; these are disclosed constructed cases.
An unexpected disagreement or false physical scope stops execution and is retained.

One deterministic replay checks byte identity with matching input hashes. Unit
tests address boundary behavior, not illustrative formatting. Record observed
compute/memory, failures and unsupported resource enforcement. Cloud, hardware,
operator performance and full recovery comparisons are outside this protocol.
