# CARTAN research

Current decision, 23 November 2026: ordinary retry and supported abort suffice
in the frozen synthetic retention case. Physical decision relevance remains
unresolved. The next input is a revision-specific record with independent
retention evidence, the complete ordinary history and owner-backed limits.

## Start with the current question

1. [Retention decision memo](decisions/RETENTION-2026-11-23.md): architecture,
   source audit, complete-history witnesses, independent check and negative result.
2. [REA-1 evidence admission](experiments/retention-evidence-admission.md): newer
   methods, public archive triage, required records and falsification rules.
3. [Research priorities](ROADMAP.md): what the evidence permits next.
4. [Session handoff](../docs/SESSION_HANDOFF.md): integrated state and lane ownership.

## Completed studies

| Record | Question and result | Evidence class |
|---|---|---|
| [Exchange](results.md) | 15 scenarios and 27 sensitivity points; separate truth scoring exposes deliberately hazardous cases. | Abstract software verification |
| [Reports and certificates](block-2/results.md) | B0/C tie over 42 histories and 186 prefixes; separate conditional interval/electrical calculations. | Constructed null result and mathematical checks |
| [Interface evidence](block-3/results.md) | 21 cases, 256 classifications, four decision statuses and separate physical propositions. | Constructed logical worlds |
| [Observation model](block-4/results.md) | 34 cases; 8 voltage and 269 topology comparisons agree with conventional references. | Conditional numerical/graph checks |
| [Retention](decisions/RETENTION-2026-11-23.md) | Joint ambiguity survives; a common ordinary retry/park succeeds. Seven controls and a distinct checker. | Synthetic finite-history result |

These results remain separate. No count is a physical reliability sample.
The [observation dossier](../backend/observation_model/interface-profile.json)
identifies missing unit calibration and qualification. The
[first-study design](experiments/first-study.md) remains proposed; REA-1 narrows
its immediate input to archival mechanical-retention evidence.

## Sources and decisions

The [initial source ledger](sources.md), [block 2 methods](block-2/sources.md),
[block 4 sources](block-4/sources.md), [recovery follow-up](block-4/source-followup.md)
and [newer-method review](experiments/retention-evidence-admission.md) distinguish
what was actually read from access gaps. Architecture decisions are retained
under [decisions/](decisions/). [Existing evidence](evidence/) stays immutable;
new interpretations name the records they qualify.

## Preserved block 1 introduction

16 November 2026. Owner: research, `research/architecture`. Status: exploratory.

The first useful question is whether a recovery decision needs information that
the installed interface cannot provide. A new controller has no automatic
advantage over a well engineered procedure using the same observations. A cheap
independent sensor, a passive interlock, or safe abandonment may be preferable.

This block preserves the long-term goal of robotically maintainable spacecraft.
It establishes a research specification, an interchange contract and a bounded
software verification exercise. It establishes no physical capability, customer,
novelty, accepted safety level or commercial advantage.

Read in this order:

1. [Current state and discrepancies](current-state.md).
2. [Sources, claims and counterevidence](sources.md).
3. [Architecture decision](decisions/ADR-001.md).
4. [Mission assumptions and physical model](specification.md).
5. [Exploratory protocol and baselines](protocol.md).
6. [Results and next decision](results.md).
7. [First discriminating study](experiments/first-study.md), proposed and unexecuted.

The immutable UI handoff is under `contracts/cartan/v1/`; its checkpoint names
the commit and hashes. A synthetic fixture is presentation data, never evidence.
The separately labeled model traces may demonstrate software behavior only.
