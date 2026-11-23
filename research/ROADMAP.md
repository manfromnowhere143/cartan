# CARTAN research priorities

Updated 23 November 2026. The destination remains maintainable, upgradeable
spacecraft. The latest [synthetic retention result](decisions/RETENTION-2026-11-23.md)
finds ordinary recovery sufficient. [REA-1](experiments/retention-evidence-admission.md)
is the immediate admission gate for a physical claim; it follows the newer-method
review and public archive triage. No new planner is justified by the current case.

The next milestone is review of an existing record for one identified interface:
independent retention reference, complete ordinary history, restart/interlock
behavior and owner-backed support/load/time limits. Those inputs are missing.
The current mechanical scope keeps external support present and excludes orbital
motion, approach, electrical separation and an operational release procedure.
Broader electrical and physical-study items below remain later, separate gates.

## First priority: establish what observations mean

First identify one mechanical, support and firmware revision under REA-1.
A circuit revision is needed only when the separate electrical question is resumed. Map each channel to its
physical sensing location, acquisition time, operating domain and uncertainty.
Establish which faults break the relationship between motor position, engagement
and load capacity. Inventory source and return paths, including module-side
supplies and stored energy. Unknown bounds remain unknown.

Current documentation, credible calibration, qualified limits and
restart traces are the next useful inputs. No supplied numerical fixture is a
measured vendor parameter. If ordinary sensing, interlocks and reviewed procedures
already justify the decision, retain the simpler system.

## Second priority: define the fault envelope

Preserve shared mechanics, supplies, wiring, clocks, calibration and software as
possible common causes. Distinguish a new acquisition from delivery of an old
sample. Record what survives a restart and what must be reacquired. Use real
traces or engineering bounds; do not assign fault frequencies to make a model
appear complete. A consistent belief is only as sound as its coverage of reality.

## Third priority: establish a useful comparison

The [first-study protocol](experiments/first-study.md) requires competent B0
interlocks and recovery, a trained B1 operator, B2 sensing or passive changes,
explicit C inference and a hold/abort arm. Existing counterpart-release capability
belongs in the selected unit's baseline. Algorithm comparisons receive the same
information. Changed hardware carries its integration and lifecycle burden.

Freeze allowed diagnostics, owner-backed limits, endpoints and trial rules before
scoring. Preserve safe aborts and unresolved outcomes. An unsafe baseline failure
is not required. Prefer B0 when equivalent and B2 when it resolves the problem
more simply at acceptable cost. If no consequential gap or owner-backed need can
be established, stop product expansion and retain the research record.

## Fourth priority: increase physical fidelity where needed

A validated circuit envelope or constrained contact model is justified when it
changes the decision. Geometry, compliance, materials, loads, source paths and
actuator behavior need independently checked inputs. A scalar electrical fixture
or fixed-host model cannot establish a free-body servicing result. Contact and
load-capacity qualification remain separate from logical engagement.

## Fifth priority: justify algorithmic complexity

Only a demonstrated decision problem can justify an additional planner or
estimator. It needs bounded latency, separate certificate checks and meaningful
ablations. The completed counting comparison found no advantage over its simple
baseline. The latest exact calculations also agree with conventional references.
Learning or advanced reachability methods do not gain priority merely by being new.

## Sixth priority: conduct a contained physical study

A qualified fixture, independent truth instrumentation and predeclared stop rules
must precede any physical trial. Separate calibration from validation, balance
trial order and retain all attempts. Measure recovery, safety, interventions,
time and cost separately. A laboratory result would still not qualify operation
in space. No physical study has been performed by CARTAN.

## Seventh priority: publish an inspectable record

Daniel has delegated the publication choices. The selected release is public
with Apache-2.0 for original CARTAN material and separate media rights. Preserve
third-party attribution and verify the exact contents and remote readback. See
[the publication record](../docs/PUBLICATION-2026-11-16.md). Publication does not
supply independent review or replication.
UI deployment remains owned by the UI lane; research does not change its DNS or
hosting configuration.

The implementation remains a set of independent offline studies, with immutable
inputs, explicit observation/inference/scoring boundaries and bounded execution.
UI consumes frozen v1 fixtures; the newer analytical records need a reviewed
adapter. Setup retains launcher, shared configuration and MCP ownership.
