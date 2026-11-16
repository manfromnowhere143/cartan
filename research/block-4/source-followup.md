# Recovery prior art and the next physical study

Read on 16 November 2026 after the frozen observation study. This addendum does
not change its inputs, cases or results. The original source ledger remains part
of the execution manifest. These additional sources narrow the proposed research
claim and strengthen the comparator required for a future experiment.

## Additional primary sources

S26. Space Applications Services, [HOTDOCK product sheet](https://www.spaceapplications.com/wp-content/uploads/2019/05/7_Product-Sheet_-HOTDOCK-1.pdf).
Both pages read. The document is undated; its URL is not a publication date.
The brochure describes active-counterpart demating after the other side becomes
inoperable. Its fully mated test figures and larger headline capacities are
different claims, without the full underlying test envelope. Neither supplies a
CARTAN operating limit. Local PDF: 315,346 bytes, SHA-256
`e9bf62c6a669a3684f5d459ef1cc4fb48c3370f54368158bd9d85a5b6394f204`.

S27. DFKI, [PERIOD project and benchmark](https://robotik.dfki-bremen.de/en/research/projects/period-og12).
Project description, test captions and publication index read. The page warns
against ranking its release-under-load videos because initial misalignment
conditions differ. The videos were not played. The project page is a discovery
source; the two papers below supply the methods reviewed here.

S28. Yüksel and colleagues, 2022, [A methodology for electromechanical evaluation
of multifunctional interconnects for on-orbit servicing demonstration](https://doi.org/10.5281/zenodo.7319796).
Read sections 3–4, evaluation in section 5, discussion and conclusion. The electrical
method covers operation, electrical characteristics, interference and recovery
after power or control-communication interruption during coupling, coupled and
decoupling conditions. Its ontology examples include fictional values explicitly
separated from confidential test data. This is direct prior art for interrupted
interface recovery, not merely nominal coupling. Author-archived PDF: 1,091,511
bytes; its hash is in the accompanying retrieval receipt.

S29. Brinkmann and colleagues, IAC 2022, [A Standard Interconnect Benchmark for a
European In-orbit Services, Manufacturing and Assembly (ISMA) Demonstrator](https://doi.org/10.5281/zenodo.7064066).
Read sections 3.1–3.6, 4.1.4, results examples and conclusion. The method controls
mounting distances, records starting alignment and searches capture limits.
It includes counterpart release after an active interface becomes unable to
decouple. Selected results and a total of 376 mechanical test cases are reported;
the public paper does not provide a complete comparative raw dataset. Its
task-dependent scoring is not a mission-independent ordering of interfaces.
Author-archived PDF: 1,142,517 bytes; hash retained in the retrieval receipt.

S30. Boissonnade and colleagues, [Prototyping and Testing System Interconnect
Standard Interoperable for Orbital Services](https://www.mdpi.com/2673-4591/133/1/194),
Engineering Proceedings 133(1), 194, published 15 May 2026,
DOI 10.3390/engproc2026133194. Full publisher HTML read, including methods,
Tables 1–2, limitations and data statement. A common passive interface is tested
with three interface families. The emphasis is functional electrical continuity;
reported selected coupling and bias tests pass. The paper describes synchronized
robot motion, force/torque and electrical measurements, while detailed results
remain with project partners. This is prototype evidence for that project,
not flight qualification or evidence for CARTAN. The DFKI PDF returned HTTP 403
and the publisher PDF was unavailable through the browser fetch; publisher HTML
resolved the earlier full-method access gap. No raw dataset was recovered.

## Decision

Interrupted exchange, recovery after loss of power or communication, a redundant
active counterpart and recording test context all have substantial prior art.
They cannot form an unsupported novelty claim for CARTAN. A new planner is still
the lowest priority until one unit's observations and permissible recovery actions
are understood. The current exact voltage and connectivity calculations remain
conventional methods verified on constructed cases.

The useful candidate contribution is narrower: a reproducible account of what
each observation establishes at a specific decision time, including the assumptions
under which a safe release or continued hold is justified. It might support an
auditable recovery procedure even when completion or speed does not improve.
That possibility is a hypothesis, not a measured benefit.

The [first-study protocol](../experiments/first-study.md) continues to govern the
proposed physical comparison. Its B0 procedure must include the selected unit's
documented restart, reread and recovery capabilities, including counterpart
release where actually supported. B1 receives the same available history and a
trained operator. B2 includes a simple direct engagement or terminal measurement
and any appropriate passive interlock. C receives the same information as its
algorithmic comparator. The independent truth channel is withheld from all arms.

First characterize acquisition time, sensor response and mechanical/electrical
mapping on one contained, identified revision. Use ordinary protections and no
hazardous baseline event. Separate calibration from validation runs and preserve
complete attempts. Initial geometry, support, load, energy, supply condition and
fault placement must be matched or reported as different conditions. A common
command or a shared coarse display label is not evidence of indistinguishability.

If ordinary procedures resolve the decision before the reviewed hold limit,
retain that negative result. If additional sensing does so at lower total burden,
prefer it. Only a surviving, independently verified ambiguity warrants the
comparative recovery stage. The proposed study measures verified recovery,
safe abort, unresolved outcomes, interventions, elapsed time and system burden
separately. Sample size, useful effect, limits and accepted uncertainty still need
owner-backed values; no numerical physical success threshold is invented here.

## Remaining material

Current unit and firmware documentation, complete circuit topology, calibration,
qualified mechanical/electrical limits and real restart/fault traces are missing.
The public PERIOD and Space USB papers do not replace those records. The 2025
interface survey and interoperable-design papers cited by S30 were located in its
references but have not been read. An IAC 2024 HOTDOCK evolution abstract was
located but its PDF was not recovered. This targeted review does not establish
exhaustive or latest-in-every-subfield coverage. No authors were contacted.

Continue the physical observation dossier and seek the missing records. Narrow
the novelty claim now. Stop expansion into a recovery product if no consequential
gap or owner-backed need can be established. The long-term spacecraft maintenance
vision remains distinct from this bounded research question.
