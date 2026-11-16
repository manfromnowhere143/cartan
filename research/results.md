# Research block 1 results and recommendation

16 November 2026. **Narrow and continue inexpensive observability work.** There is
not yet evidence for a separate CARTAN recovery product or a better controller.
The strongest next question is whether a physically reachable partial latch and
a completed latch remain decision-relevantly indistinguishable after competent
ordinary sensing, interlocks and recovery procedures.

The research review changes the emphasis from inventing an uncertainty controller
to testing that information gap. Prior robotic replacement, sensing, tooling,
connector sequencing and recovery methods are substantial counterevidence to broad
novelty ([source ledger](sources.md)). A simpler procedure or hardware change is a
valid preferred result. No customer, funding, hardware validation, flight heritage
or measured CARTAN superiority is established.

## What was completed

- Audited the actual worktrees, ownership, resources and hash-matched input packet;
  reconciled the historical discrepancies in [the audit](current-state.md).
- Read accessible primary methods beyond abstracts, added CMU contact/recovery
  methods, a dated modeling standard and technical patent prior art. Reading
  scopes and inaccessible material are recorded, not inferred away.
- Committed [ADR 001](decisions/ADR-001.md), assumptions and protocol **before**
  code execution; froze the [v1 contract](../contracts/cartan/v1/README.md) before
  the implementation. No service or root dependency stack was added.
- Implemented a deterministic abstract hybrid model, synthetic observation adapter,
  possible-state guard, separate truth scorer and bounded scenario runner.
- Designed [the first discriminating study](experiments/first-study.md), including
  competent B0, B1, B2, C and null-action arms. These comparisons were **not run**.

## Executed checks and actual outcomes

Code and frozen case source: commit `aee96ea`. Model `abstract-exchange/0.1.0`.
Run mode is `simulation`, evidence scope `model_only`. The UI fixture remains
separate, hand-authored `synthetic_fixture` data with no outcome evidence.

| Check | Observed result | Interpretation |
|---|---|---|
| Scripted verification | 15/15 cases match their predeclared expectations | Includes deliberately unsafe controls; does not mean 15 safe exchanges |
| Toy discharge sensitivity | 27/27 points match the analytic flow and threshold decisions | Tests formula/guard behavior, not measured discharge or safe limits |
| Boundary/adversarial unit suite | 12 tests passed in 0.002 s | Checks stale/false evidence, epoch changes, residual energy, threshold boundaries and sticky hazards |
| Contract fixture | Valid; 16 negative controls rejected; known false/zero accepted | Data consistency only |
| Executed model bundle | Valid under frozen v1 and semantic validator | No physical or scientific validation follows |
| Deterministic replay | Same input/configuration hashes and byte-identical core records | Both sets of full records retained; not independent samples |

Full records: [first attempt](evidence/verification-v1/attempt-01/bundle.json),
[case assertions](evidence/verification-v1/attempt-01/attempts.json),
[sensitivity](evidence/verification-v1/attempt-01/sensitivity.json),
[replay](evidence/verification-v1/replay-02/bundle.json), and
[verification receipt](evidence/verification-v1/verification-receipt.json).
Each attempt directory has a summary and SHA-256 manifest. Core canonical digest:
`360c9a79c92c3996a775b3d54f51699b0bb33af28711c14ae6554c15561d4237`.

The nominal remove/return sequence completes with none of the three defined
hazards. Six cases end in a modeled safe abort. Unexpected contact blocks motion
but earns no safe-abort claim; loads remain unmeasured. Impossible separation is
rejected without mutation. The null control holds without completing service.

Five intentional controls contain hazards: residual-energy demating, unsafe
energization, loss of the only retention path, false-positive latch evidence
combined with partial actuation, and completion after unsafe demating. All are
detected by the truth scorer. The last run completes but remains unacceptable;
later success does not erase the hazard. These counts have no mission-frequency
interpretation. No baseline was deliberately weakened or scored as a comparator.

The false-positive case is the critical limitation: a fresh, apparently valid
`locked` report can exclude the actual partial state, after which the guard permits
support release. Conservative action selection is only as sound as the state set
and fault assumptions. A unit check widens that set and blocks release; it does
not establish a new estimator, calibrated fault coverage or a comparison win.

The model uses instantaneous actions and 0/10 synthetic elapsed seconds. Those
numbers are not recovery-time measurements. Interventions are zero because no
operator was present, not because autonomous recovery outperformed one. Load-limit
outcomes are unmeasured; unrecoverability is unknown. Mass, power, cost, reliability,
human workload and mission safety thresholds remain unmeasured/unknown.

One specification clarification is retained explicitly: the executable safe-abort
definition additionally requires `contact == clear`. The specification's short
outcome description lists halt/isolation/energy/retention without that extra term.
The frozen cases require the stricter behavior, and the unexpected-contact run is
therefore not labeled a safe abort. Interpret this block using that declared code
condition; reconcile the prose in a successor model specification. Frozen inputs
and their original hashes are preserved. Unknown reports can still permit modeled
hold/isolation; they do not authorize exchange progress. Neither is proof that
holding or isolation is physically safe on an unspecified circuit.

## Resources, failures and reproducibility

Each runner used one worker, a five-CPU-second limit, 15 cases and 27 sensitivity
points. Observed kernel/output CPU time was 0.00843 s then 0.00712 s; wall time
0.00969 s then 0.00737 s. Peak process RSS was 24,641,536 then 22,462,464 bytes.
macOS rejected the requested 268,435,456-byte address-space limit with
`current limit exceeds maximum limit`; memory enforcement is **not claimed**.
The two initial output directories total 862,926 bytes, below the 10 MiB cap.
Python was 3.14.2 on macOS 14.4 arm64; no install, server, GPU or paid job ran.

No model or contract verification failed in this block. Earlier operational
failures are retained in the audit: sandbox-restricted process/memory inspection
and Git metadata writes required authorized retries; Pillow was absent, so PDF
pages were inspected individually. A standards page retrieval failed. These are
not erased or converted into scientific findings.

Reproduce with the commands in [backend/README.md](../backend/README.md), using a
new output directory. Compare input/configuration hashes and `core.json`; wall
timestamps and resource usage are expected to differ. The 27-point calculation is
exploratory and shares its analytic expression with the implementation; the unit
suite also checks a fixed reference value and time subdivision. No calibration,
held-out test, independent replication or physical validation occurred.

## Handoff, gaps and next action

Contract v1 is available at `2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a`, with
[its stable handoff](../memory/checkpoints/research-20261116T095000Z-contract-v1.md).
Research owns it. The UI worktree was read-only inspected again after execution:
clean at `f0d2767`. No UI integration or consumption is verified. Present these
new model traces as abstract verification, including unsafe controls, not a
physical demonstration. Future physical endpoints require a reviewed contract
successor; v1 bytes remain frozen.

Missing evidence includes the full Gemini transcript and opportunity reassessment,
restricted interface recovery manuals, actual operator requirements, circuit and
mechanical limits, calibrated sensors, common-cause data, asset rights/geometry,
and complete standards/IP review. The review was bounded, not exhaustive; Waterloo
specific method coverage remains a gap. Lack of access proves no absent capability.

Next: obtain or select one documented interface/circuit and review whether the
proposed ambiguous states are reachable and consequential. Apply Stage 1 of the
first-study design before expanding software or procuring hardware. Continue only
cheap desk research until that question is answerable. Prefer or merge into a
simple procedure/sensor solution if it meets the real requirement. Stop the extra
controller branch if equal-information B0 is equivalent, or if no useful gap is
found. Physical work still requires qualified review and explicit authorization.
