# Block 2 results: evidence quality matters more than observer complexity

16 November 2026. **Continue the evidence-verification direction; retire the
counting-only observer as a proposed algorithmic advantage.** Within this declared
measurement problem, competent B0 and the possible-state observer are equivalent.
That is a result about this model, not all recovery controllers or all spacecraft.

The useful advance is a conditional, reproducible answer to what a report sequence
can establish, together with witnesses showing when it cannot. No new theorem,
flight capability, validated product or superiority over research institutions is
claimed. The long-term spacecraft-serviceability ambition remains; this block
improves the evidence needed to pursue it responsibly.

## Source-backed change in direction

The [new primary review](sources.md) recovered public preliminary interface detail
that was missing from block 1's reading. That correction strengthens the procedural
baseline and prevents treating unavailable documentation as absent capability.
Recent diagnosis research also supplies substantial prior methods. The architecture
therefore separates a proposed solution from a check of the evidence supporting it.

[ADR 002](../decisions/ADR-002.md), [mathematics](mathematics.md) and
[protocol](protocol.md) were committed as `22e725b` before implementation. Code
and finite cases were frozen at `7c37511` before execution. The first block's code,
results and UI contract remain unchanged. This study uses its own research format;
it is not a new physical test or a v1 UI run.

## Equal-information comparison

Both policies received identical binary reports, acquisition identities, time and
epoch fields, and an identical assumed corruption budget `k`. B0 counts reports;
C propagates possible truth/error-count states. Neither receives generating truth.
The independent harness checked 42 allowed histories and **186 prefixes**.

| Assumed maximum corrupt acquisitions | Histories | Observed valid acquisitions to a decision, both policies | Proven worst-case bound |
|---|---:|---:|---:|
| 0 | 2 | 1 | 1 |
| 1 | 8 | 2–3 | 3 |
| 2 | 32 | 3–5 | 5 |

B0/C agree at every prefix, and neither removes the generating truth within the
declared fault envelope. The worst-case requirement is `2k+1` valid acquisitions;
balanced words of length `2k` remain compatible with either truth. The records
retain those lower-bound witnesses. These are acquisition counts, not recovery
seconds. No error budget has been validated on actual hardware.

Important limits survived the checks:

- Repeated delivery of one acquisition contributes one observation. Counting it
  twice can fabricate certainty.
- Two wrong reports under an assumed one-error budget yield a wrong but nonempty
  result. Model mismatch is not always detectable from internal consistency.
- Without a bounded error assumption, an all-one history remains compatible with
  both truth states. A shared stuck-high cause similarly defeats duplicate channels.
- One genuinely correct additional measurement resolves the toy fact immediately.
  That is a change of information, not an algorithmic victory. B2 hardware validity,
  independence and burden remain unmeasured.
- A logical passive interlock can prevent a release without full fault diagnosis;
  this truth table is not a built or validated interlock.
- A retention fact alone does not establish the other release preconditions.
  B1 human performance and full B0/C recovery-system performance were not tested.

## Numerical and electrical results

Six exact closed-box cases passed. Three provide a common observation despite
zero overlap volume: endpoint contact, a shared edge and coincident point boxes.
The checker returns a witness rather than declaring separation. A tiny positive
rational gap remains a gap. These are elementary mathematical counterexamples,
not an empirical refutation of an external paper or a claim of novel geometry.

The electrical calculation is a separate normalized-voltage model with bounded
RC decay and a possible constant backfeed floor. It does not reuse the first
model's energy-fraction field. With initial upper voltage 1 and a synthetic limit
of 0.1, the first integer time with an exact rational upper-bound certificate is:

| Assumed upper time constant, synthetic seconds | Floor 0 | Floor 0.05 | Floor 0.1 |
|---:|---:|---:|---|
| 1 | 3 s | 3 s | No finite passive-wait certificate |
| 2 | 5 s | 6 s | No finite passive-wait certificate |
| 4 | 10 s | 12 s | No finite passive-wait certificate |

All nine cases are retained. The last column includes an allowed trajectory that
never reaches the limit at finite time. It does not say the actual circuit is
energized; it says waiting alone cannot establish the condition under that envelope.
No threshold, source floor or time constant is a measured CARTAN parameter.
Switching transients, dielectric recovery, current, arcing and loads are unmodeled.
No operational wait time or electrical safety instruction follows from this table.

## Verification and resources

Twelve new unit tests passed in 0.003 s. They cover duplicate/conflicting IDs,
stale/future/missing evidence, restart, inconsistent histories, wrong fault bounds,
observation caps, interval boundaries, separate 70-digit Decimal checks of the
rational exponential enclosure, and incomplete action preconditions.

One replay produced byte-identical `core.json` with identical input hashes. Both
output manifests and source-input hashes passed verification. Core digest:
`264ae9a10b2063d48be280a2dcb228e57d2e200b9a0dd488ae2f406a011b8a2e`.
The replay is a reproducibility check, not a second independent experiment.

Runner CPU time: 0.005643 s / 0.005027 s; observed wall time: 0.007068 s / 0.007187 s.
Peak process RSS: 24,100,864 / 23,625,728 bytes. Each invocation used one worker and
set a five-CPU-second cap. macOS again refused the requested 256 MiB address-space
limit; enforcement is not claimed. Initial paired output files total 316,496 bytes;
new reading scratch used 3,188 KiB of allocated blocks. No dependency, service,
GPU, paid job, physical action or nested model was used. No check failed.

Measurement clarification: those timings cover study evaluation before final JSON
export and exclude interpreter/import startup. RSS is the process high-water mark
sampled at that point. They are not end-to-end latency or flight-runtime benchmarks.

Full evidence: [first core](../evidence/certificate-v1/attempt-01/core.json),
[summary](../evidence/certificate-v1/attempt-01/summary.json),
[replay](../evidence/certificate-v1/replay-02/core.json), and
[execution/integrity receipt](../evidence/certificate-v1/verification-receipt.json).
Reproduction commands are in [the backend README](../../backend/certificates/README.md).

## UI coordination and remaining obligations

UI commit `8c34d1c` now contains a consumption receipt. Research independently
compared all five committed vendor payloads against frozen contract v1: exact
matches. This establishes static contract consumption, not fresh browser QA.
The new analytic records are not silently substituted into the UI's synthetic
fixture adapter. UI and setup worktrees/configuration were not edited.

All 12 original packet inputs still match hashes and sizes. The primary-source
review is bounded; actual interface fault semantics, measurement-to-retention
mapping, calibrated bounds, independent instrumentation, mission-owner limits,
complete Gemini material and economics remain gaps. Mathematical correctness of
an abstraction does not establish those facts.

Next: use the [prioritized roadmap](../ROADMAP.md) to obtain a defensible physical
observation model before expanding the planner. The claim this block rules out is
that the explicit observer alone improves this bounded-report problem over its
competent conventional equivalent. The opportunity still worth testing is whether
existing recovery evidence can be made auditable and sufficient at lower system
burden than additional sensing or interlocks. That opportunity remains a hypothesis.
