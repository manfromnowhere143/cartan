# Block 2: new primary sources and corrections

Reviewed 16 November 2026. This is an additive update to the first source ledger,
not a claim of exhaustive 2026 coverage. Papers' experiments remain their authors'
reports; none was reproduced here. No institutional affiliation is implied.

| ID | Exact source and reading scope | Finding and limit |
|---|---|---|
| S17 | [MOSAR D2.5 HOTDOCK Preliminary Design Definition File](https://www.h2020-mosar.eu/wp-content/uploads/2020/06/MOSAR-WP2-D2.5-SA_1.1.0-HOTDOCK-Preliminary-Design-Definition-File-.pdf), MOSAR-WP2-D2.5-SA **1.1.0**, **12 February 2020**, G1, public deliverable. Read cover/change record, selected requirements pp. 11–17, configuration pp. 30–31, operations pp. 33–35, selected mechanical/power/controller sections pp. 36–46. Rendered and inspected pp. 33–35. | Public preliminary detail exists: position/Hall/current/voltage telemetry, fault recovery, separate receipt/processed ACKs. `Locked` here includes controller power-off while connected; it is not CARTAN's mechanical-state label. Tables remain preliminary; switching ownership is conditional. These facts require a stronger baseline, not a claim that the actual interface has a dangerous ambiguity. Current ICD, fault behavior and calibration remain unavailable. |
| S18 | [Letier et al., HOTDOCK IAC 2020 full author paper](https://www.researchgate.net/publication/344871962_HOTDOCK_Design_and_Validation_of_a_New_Generation_of_Standard_Robotic_Interface_for_On-Orbit_Servicing), October 2020, §§2.1–2.5 read in public full-text transcription | Hall sensing, absolute encoder, power telemetry, state machine and FDIR predate CARTAN. This is the same HOTDOCK evidence family as S04/S17, not independent corroboration. The DLR copy remains restricted; an alternative public paper copy closes the earlier abstract-only reading gap. No current product specification or flight claim follows. |
| S19 | [Ni, Ornik, Chou and Coogan](https://arxiv.org/html/2606.19590v1), **arXiv:2606.19590v1, 17 June 2026**, §§III–V, VI-A/B and reported limits read | Finite fault models, bounded disturbances and reachable-set inclusions support active discrimination. Exact separation is distinct from optimizing overlap volume: Proposition 2 is one-way and the text recognizes that zero volume need not mean an empty intersection. Refinement requires sound inverse-image bounds. Runtime/hardware results are not CARTAN results. We adopt an explicit certificate check, not an optimizer score as proof. No replication or general refutation of this paper is claimed. |
| S20 | [Schreiber, Eddy and Kochenderfer](https://arxiv.org/html/2605.09158v1), **arXiv:2605.09158v1, 9 May 2026**, §§II–V and conclusion read | Fault-mode priors, observation likelihoods, lethality and recovery-time models determine scheduling. Their binary comparator deliberately has less fault structure. That comparison does not establish an advantage over CARTAN's proposed equal-information B0. We have no calibrated priors or lethality data and therefore do not import its probabilities, performance ratios or cost objective. |
| S21 | [Dong, Yin and Li](https://xiangyin.sjtu.edu.cn/Paper/24TACltl.pdf), IEEE TAC **69(1), January 2024**, DOI **10.1109/TAC.2023.3266021**, §§II–IV, Appendix proof of Theorem 1 and relevant discussion of uniform bounds read | Sensor behavior must be part of the diagnosability assumptions. Eventual diagnosis and a uniform finite delay are distinct. This is established theory, not a new CARTAN theorem. Our finite corruption-budget calculation is a deliberately small special case with its own proof and executable witnesses; no LTL/Büchi implementation is claimed. |

S17 downloaded PDF SHA-256:
`1e0231d377bc9a284cd6bac56aafaf25804d6abe08739870424bb5a0d3df678e`
(2,582,006 bytes). Original retained only in local reading scratch; no source PDF
is republished into this repository. The cited locations and digest identify the
version. Requirements are not test results; a test configuration is not a mission
qualification. Numerical competitor limits are not adopted as CARTAN limits.

The strongest correction to block 1 is documentary: it is no longer accurate to
describe all detailed HOTDOCK design material as inaccessible. This does not
recover a current operational manual or vendor fault dataset. Keep the earlier
access record as history and use this successor for current research decisions.

Unresolved: actual telemetry-to-load-path mapping; common causes and error bounds;
stored energy/backfeed; restart persistence; current hardware revision; independent
test data; operator requirement; physical limits and lifecycle economics. The
full Gemini transcript, opportunity reassessment and Waterloo-specific matched
method remain missing. New papers do not remove those engineering dependencies.
