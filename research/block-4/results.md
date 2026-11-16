# Physical observation model: results and remaining evidence

16 November 2026. Continue with a conditional observation model and a narrower
physical claim. The work now identifies documented sensor locations and separates
voltage inference from source connectivity. It still lacks a calibrated interface,
a qualified retention relationship and an owner-approved operating envelope.

The source review recovered the later public HOTDOCK D3.7 design definition and
demonstration procedures. The earlier statement that only preliminary design
information was available is superseded in that respect. Current hardware
applicability, full calibration and fault behavior remain unresolved. Source
inconsistencies were recorded rather than converted into thresholds or a driver.
See [reading scope and citations](sources.md). The subsequent
[recovery prior-art review](source-followup.md) adds 2022 benchmark methods and
a 2026 interoperability study. It strengthens the required baseline without
changing the frozen numerical experiment.

Architecture and protocol preceded implementation at `f08f288`. Code, source
typo correction, dossier and disclosed cases were frozen at `198f7fe` before
execution. The [specification](specification.md) derives the interval calculation,
defines the connectivity abstraction and records the physical validation plan.

The study retained 34 cases: 22 voltage cases and 12 topology cases. Seven inputs
were rejected as intended. The other cases produced five supported, five refuted
and 17 unresolved results within their respective model predicates. All eight
numerical voltage results matched the independent conventional corner calculation.
All 269 graph assignments matched a separate transitive-closure reference.
Eleven boundary tests passed in 0.002 seconds, including 243 interior substitutions
for an interval case, reverse polarity, uncertain acquisition time, missing bounds,
coverage intervals, possible sensor failure, witness paths and shared closure.

A low connector voltage remained distinct from isolation. The backfeed case
retained a path from a module-side source despite an open host relay. An incomplete
source inventory remained unresolved even when every declared path was open.
These are constructed counterexamples to particular inference shortcuts. They
are not observed failures of HOTDOCK or another vendor interface.

Gain, bias, residual-error and rate bounds are synthetic assumptions. A recent
reading becomes less decisive when its possible acquisition time is older or the
allowed voltage rate is larger. A probabilistic coverage interval was not treated
as a hard guarantee. The observer provides no energy, arcing, current or remote-node
certificate. An isolated source topology does not discharge a capacitor.

The source-derived [interface dossier](../../backend/observation_model/interface-profile.json)
records the incomplete mechanical mappings explicitly. Cam angle does not become
load capacity through a status label. Engagement, support and demand need separate
physical evidence. No numerical cam profile, healthy/faulty vendor trace or
retention limit was invented to make the software appear complete.

The conventional method agreed wherever a numeric comparison was applicable.
This is a verification result, not algorithmic superiority. B1 operator recovery,
B2 physical sensing/interlocks and full system recovery were not evaluated.
The earlier equal-information null result remains part of the research record.

One deterministic replay produced identical core bytes and input hashes. Both
output manifests and every recorded source/configuration hash passed verification.
Core file SHA-256:
`a692226cf27950f5e4a3ebb7c29605716eca92f660cfe4a39cb80e8e8a674d89`.
The [first run](../evidence/observation-v1/attempt-01/core.json),
[replay](../evidence/observation-v1/replay-02/core.json),
[unit log](../evidence/observation-v1/unit-tests.txt) and
[integrity receipt](../evidence/observation-v1/verification-receipt.json)
retain the complete calculations and execution scope.

Evaluation CPU time was 0.024567 and 0.024479 seconds; observed wall time was
0.027070 and 0.024613 seconds. Process high-water RSS sampled after core export
was 24,559,616 and 24,690,688 bytes. Timing excludes interpreter/import startup
and final summary/manifest export. Five-CPU-second limits were set. macOS refused
the requested 256 MiB address-space cap; enforcement is not claimed. The paired
run files total 766,951 bytes. No unexpected check failure, paid compute or
physical operation occurred.

All 12 original packet hashes and sizes still match. All 54 earlier tracked
backend, contract and evidence files checked against `73030a9` remain identical.
New analytical records use `cartan-observation-analysis/1.0.0`; frozen v1 and its
synthetic fixture are unchanged. UI advanced independently to `0afc064` during
this work. Its publication checkpoint was read; its deployment or browser state
was not independently validated by research.

The next useful evidence is one real unit's observation chain: exact circuit and
mechanical revision, sensor calibration, independent time/position/voltage traces,
fault coverage and accepted load/electrical limits. The physical validation plan
uses separate calibration and validation conditions and preserves ordinary
protections. If those observations and ordinary procedures already justify the
decision, CARTAN should retain that simpler solution. A more complex planner is
not justified by the current results.
