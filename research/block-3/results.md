# Block 3: distinct interface facts and reviewable decisions

16 November 2026. **Continue the evidence architecture; keep the physical recovery
claim narrow and unproven.** The new evaluator preserves distinctions that the
first exchange model compressed. It explains whether a declared action is
admissible, refuted, unresolved or inconsistent within a constructed logical
domain. It does not establish physical reachability, operational safety or a
recovery advantage.

## Why this extension

The public preliminary HOTDOCK material recovered in [block 2](../block-2/sources.md)
distinguishes mechanical latching, electrical contact and controller power, and
separates command acknowledgements from telemetry. These distinctions motivated
six independent propositions rather than another uncalibrated physics simulation.
No implication from ring position to a qualified load path, or from controller-off
to source isolation, is silently added. This is an architectural correction to
future modeling; the first model and its restricted evidence remain frozen.

[ADR 003](../decisions/ADR-003.md) and the initial protocol were committed at
`2ad0651` before implementation. Code, cases, tests and a clarification of report
exclusion were frozen at `3d286e4` before execution. The new analysis format is
`cartan-interface-analysis/1.0.0`, model `interface-evidence/0.1.0`. It does not
change the frozen UI contract.

## Executed checks

| Check | Observed result |
|---|---|
| 21 disclosed cases | 18 evaluated; three expected input rejections |
| Evaluated classifications | Three admissible, two refuted, 11 unresolved, two inconsistent |
| Complete-assignment cross-check | All 64 worlds × four actions agree with separately written explicit reference predicates |
| Boundary unit tests | 11 passed in 0.009 s |
| Deterministic replay | Byte-identical core, matching input hashes and valid output manifests |

The three rejected inputs claimed physical mode, an unsupported interpretation
profile, or numeric one in place of a Boolean proposition. Future, stale, missing
and old-epoch reports were retained with exclusion reasons. Duplicate deliveries
added no evidence; conflicting acquisition IDs yielded inconsistency, including
when the conflicting reports were stale. All results retained physical
authorization as `not_assessed`.

Acknowledgement, raw zero-voltage, controller-off and ring-position cases remained
unresolved. **That is a declared software behavior, not a measured ambiguity in
HOTDOCK.** The default profile intentionally supplies no unvalidated mapping from
telemetry to physical predicates. It cannot determine what a current vendor
procedure could establish with its actual measurements and fault coverage.

Under the explicitly synthetic, assumed fault-free binding, a retention report
made the simplified support-release predicate admissible while 32 logical worlds
remained. Full state identification was unnecessary for that declared predicate.
Its omitted load, geometry and mechanism conditions prevent interpreting the
classification as permission to release a real module.

Mixed results retain one satisfying and one violating witness. An empty set is
inconsistent, never vacuous permission. Independent reference logic reduces a
particular implementation risk, but shares the same declared Boolean abstraction;
it is not an independent physical oracle.

Full records: [first core](../evidence/interface-v1/attempt-01/core.json),
[summary](../evidence/interface-v1/attempt-01/summary.json),
[replay](../evidence/interface-v1/replay-02/core.json),
[unit log](../evidence/interface-v1/unit-tests.txt), and
[integrity receipt](../evidence/interface-v1/verification-receipt.json).
Canonical core digest:
`911ad944d618e888e6af83d0eddde43b89ce15c53ee135159b5935017959eec6`.

## Resources and preservation

Runner CPU time was 0.030557 / 0.022337 s; observed wall time was
0.070430 / 0.022557 s. Sampled process high-water RSS was 28,917,760 / 25,968,640
bytes. Timings exclude interpreter/import startup and final summary/manifest
export; RSS was sampled after core export. These are not flight-runtime benchmarks.

Both runs set a five-CPU-second cap. macOS refused the requested 256 MiB
address-space limit, so memory-cap enforcement is not claimed. The initial paired
run files total 1,380,069 bytes. No check failed unexpectedly. No cloud job,
dependency installation, service, hardware action or model session was needed.

All 12 original packet files still match their recorded hashes and sizes. All
38 previously tracked backend, contract and evidence files checked against
`f592075` remain byte-identical. All five UI vendor files at `de81efb` match frozen
v1. The UI checkpoint was read, but its runtime/browser checks were not repeated.
UI and setup working files were not edited. README diagram rendering is separate
[presentation QA](../../docs/qa/readme-20261116/REVIEW.md), not scientific evidence.

## Next decision

The highest-value missing input is still a reviewed physical observation model:
one current interface/circuit revision, reachable interruption states, qualified
load/isolation predicates, measurement uncertainty, fault/common-cause coverage,
restart semantics and owner-backed limits. Preliminary documentation and model
consistency cannot substitute for those inputs. Complete original Gemini material
and real economic measurements also remain absent.

Continue source and interface analysis under the [roadmap](../ROADMAP.md). Prefer
ordinary sensing, interlocks and procedures if they meet the requirement. Do not
expand the planner until the [first discriminating study](../experiments/first-study.md)
establishes a useful gap. Stop a proposed differentiator when an equal-information
baseline is equivalent or a simpler system is adequate. The earlier counting-only
null result stands; this block makes no new comparative-performance claim.
