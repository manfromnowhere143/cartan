# Admission protocol for an interrupted-retention record

REA-1, 23 November 2026. Research-owned, proposed offline protocol. This makes
Stage 1 of [the first study](first-study.md) concrete for mechanical retention
with external support present. It neither starts a physical experiment nor
selects an installed interface. The frozen case remains SYN-RC-1.

**Next milestone:** admit one revision-specific record that can settle whether
retention ambiguity changes a useful recovery decision, or retain a negative
result. A new planner is not the next deliverable. The immediate physical-research
verdict is **BLOCKED ON PHYSICAL EVIDENCE**: synchronized independent retention
evidence, ordinary operator history, applicable restart/interlock documentation,
and owner-backed support, load and timing limits are missing.

The [decision memo](../decisions/RETENTION-2026-11-23.md) remains unchanged:
SYN-RC-1 has a joint ambiguity witness, but an ordinary retry completes capture
and a supported park completes abort. Its result is BASELINE SUFFICIENT. The
42-history/186-prefix counting-baseline tie and block 4's 34 constructed cases
are different studies; none is a measured retention experiment.

## Architecture and authority before this addition

The memo contains the complete subsystem reconstruction. This continuation
rechecked root, common Git directory, worktrees, remote, HEAD and pending work.
Research remains at `04a0ebaffea22929a8e2e20c4857df25f3947acd` on
`research/architecture`; its base against locally cached main remains that HEAD.
The local main reference is historical, not a freshly fetched remote assertion.
The prior research artifact and notes are uncommitted. Setup's pre-existing
`config/environment.json` change remains outside research ownership.

Setup remains at `70456b0`; UI remains at `dcc8d8e`, now with pending continuous
interior work: frontend application/style, release/tests/QA, architecture and
provenance documents, and its memory index/checkpoint. Only UI status was read
in this continuation. Nothing was integrated, reset or edited in that lane.
The stale integration-worktree registration was left alone. Canonical setup
records still assign launch configuration to setup and specify full access.

The only new functional contract here is an evidence review protocol. Its
consumers are a research reviewer and a future explicitly scoped abstraction
review. It has no runtime or actuator consumer. `backend/retention_case` accepts
its fixed synthetic fixture; it is **not** an importer for measured records.
The numerical observation dossier remains uncalibrated for an installed unit.
No v1 contract, backend, existing evidence or frontend change is needed.

```text
Existing archive + revision/limits documents
    -> REA-1 identity, timing, independence and coverage review
    -> complete-history consistency + ordinary-recovery comparison
    -> scoped result, or an explicit missing-evidence finding
    -> only then a separate finite-abstraction decision

Separate truth record -> independent scoring; never policy input
Existing SYN-RC-1 -> software reference only; never a physical calibration
```

## Targeted methods review and decisions

Primary sources were consulted on 23 November. This is a targeted review, not
an exhaustive ranking of the field. The read scopes below are selected methods
and assumptions, not a claim of independently verifying every theorem or
reproducing each experiment. Recent preprints remain preprints.

| Source/revision and read scope | Demonstrates, excludes, and changes |
|---|---|
| R1. Vahs, Verhagen and Tumova, [arXiv:2603.10572v2](https://arxiv.org/html/2603.10572v2), 5 May 2026; belief model, assumptions 1–3, control construction, theorem 7 and hardware description | **Theory and author-reported simulation/bench results.** Information gathering and goal control are combined with a probabilistic safety filter. The stated assumptions include samples from the true belief, feasible filtering and safe belief updates. The hardware task is navigation on a planar space analogue, not interface retention. This rules out treating belief-space reach–avoid as an unexplored category. Defer adoption: CARTAN lacks a validated dynamics/observation distribution, and a probabilistic or expected-time statement cannot replace its current universal bounded deadline. |
| R2. Feng, An and Xu, [arXiv:2511.09192v1](https://arxiv.org/html/2511.09192v1), 12 Nov 2025; problem formulation, ORBF theorem/termination condition, algorithms 1–2 and experiments | **Theory and numerical benchmarks.** Observation-aware barriers update conditional probability bounds for a specified system/policy, using known i.i.d. disturbances; reach–avoid includes an almost-sure terminal-entry assumption. Offline synthesis and online backward updates are already established in this work. This rules out a general novelty claim for updating safety estimates with observations. Use exact finite consistency first; do not fit a probability model or add an SDP stack without applicable calibration. |
| R3. Wan et al., [arXiv:2609.06036v1](https://arxiv.org/html/2609.06036v1), 5 Sep 2026, draft v0.5; §§2–5, especially theorem 2 and its proof | **Preprint theory.** For a fixed probing policy, distinguishability limits admission reliability/usefulness; the all-policy version needs a bound over every allowed probing policy. The broader assurance argument assumes a design-time certificate and a no-bypass execution rule. It does not establish a certified fallback for CARTAN. Rules out claiming all-policy impossibility from one common trace. Keep conservative actions inside CARTAN's declared action comparison and require a complete bounded search for a no-continuation result. |
| R4. Ni et al., [arXiv:2606.19590v1](https://arxiv.org/html/2606.19590v1), 17 Jun 2026; §§III–V read in the preceding block, as recorded in the memo | **Mathematical method.** Whole-history output consistency is the immediate predecessor, not a new CARTAN theorem. Marginal overlap does not construct a joint trajectory. Continue requiring causal, temporally coherent witnesses and explicit model/error bounds. |

The existing HOTDOCK, PERIOD, NASA mechanism/surface-interface and CMU recovery
source ledger in the decision memo remains controlling for their inspected
scopes. Interruption testing, counterpart recovery and dissimilar confirmation
already have precedent. A broader future direction is **decision-relevant
evidence for serviceability**: establish which observations or passive constraints
actually change an achievable task outcome. That is a research hypothesis, not
demonstrated novelty, advantage or a new mathematical framework.

## Public data triage

The review distinguished a located archive from inspected measurements. No raw
archive was downloaded or executed. These findings therefore narrow the next
step; they do not prove that suitable data exists nowhere.

| Candidate and fixed reference | Checked evidence and admission disposition |
|---|---|
| D1. [s-FEAST Dryad archive](https://datadryad.org/dataset/doi:10.5061/dryad.xgxd254r1), DOI `10.5061/dryad.xgxd254r1`, published 21 Aug 2024; API version 8, version ID 313824. [Author repository](https://github.com/treyra/s-FEAST/tree/9ead8a297f5e25c0d961c39967fab9ced2b17485), commit 30 Aug 2024 | **Author-described simulation and physical spacecraft-simulator data.** Landing-page README, data-field descriptions and API metadata inspected. Useful precedent for active diagnosis and retaining actions, beliefs and fault states. The 5.13 GB collection concerns spacecraft fault estimation/collision avoidance; it does not establish a prepared-interface retention model. The article's full text returned 403; no full-method reading is claimed. Do not import code, translate an actuator fault label into a retained load path, or call this a CARTAN benchmark. |
| D2. Park et al., [connector-wiggling paper](https://www.nature.com/articles/s41467-026-74643-3), DOI `10.1038/s41467-026-74643-3`; [Figshare dataset v1](https://doi.org/10.6084/m9.figshare.32133736.v1), published 30 Apr 2026 | **Located measured-data archive, contents uninspected.** Publisher-indexed data statement and Figshare metadata establish the archive, not the needed fields. Metadata lists `dataset.zip`, 957,205,208 bytes, CC BY 4.0. Publisher/PMC full-page access failed and an alternative public XML request timed out; methods were not fully read. No retained-path truth, interrupted capture, reset history or applicable limits were verified. Keep as a discovery lead; do not claim these fields are absent from uninspected files or use it to calibrate retention. |
| D3. [PERIOD electrical method](https://doi.org/10.5281/zenodo.7319796), ASTRA 2022; [mechanical benchmark](https://doi.org/10.5281/zenodo.7064066), IAC 2022; Space USB source follow-up | **Documented tests and selected reported measurements.** The preceding block read interruption/recovery and counterpart-release methods. The public record does not provide the complete needed unit-level archive; confidential details and fictional ontology examples must remain distinct. Missing public detail is not evidence that the hardware or its ordinary procedure fails. The full-current Space USB access gap is retained. |

Local API retrievals were limited to 2 MB each and used no account credentials.
Successful metadata bodies total 15,111 bytes. SHA-256 receipts:

- Figshare: `4e617b86eb532b50b45ac0b8dce1fd65cf6b85f7d3514c0318fd7dd76c7b22bb`.
- s-FEAST commit metadata: `f7ac7a439d935789642f0573d042b264b4a5a15e7397fe1b4afe29c1c623ed6d`.
- Dryad: `d730871aa640e3e72a203d77e4be6517a1460aa8b0b05edd93af039013f27ba9`.

## Required evidence record

The following is an admission specification, not an implemented schema or a
fabricated experimental record. Each supplied item needs a source ID, revision,
hash or immutable reference, responsible owner and applicable scope. Missing
values stay UNKNOWN with a reason. A dossier or metadata entry cannot fill a
measurement field. Partial evidence remains useful in its own stated scope.

| Record group | Minimum information for the requested decision |
|---|---|
| Identity and boundaries | Identified mechanical, firmware and support revisions; configuration changes; permitted archival use; civilian supported-capture scope. HOTDOCK D3.7 is a precedent until applicability is established. |
| Causal mechanism | Command receipt → drive → engagement → retained load path, with separately justified relations, backlash/compliance and downstream fault coverage. No equality is inferred from matching names or an ACK. |
| Ordinary information | Every available command, acknowledgement, raw readback, fault flag, installed interlock, allowed image/video and relevant operator display/diagnostic; units, quantization and missing-data semantics. No advantageous channel withheld from B0/B1. |
| Timing and resets | Acquisition and arrival times, clock relation/uncertainty, controller epoch, interruption ordering, cache/persistence and reset behavior. Shared bias and other persistent variables apply jointly across the full trace. |
| Independent reference | Measurement of engagement/load-path condition, calibration/error scope, and a reviewed mapping to capacity versus demand. A second drive-derived indication is not automatically independent; shared mechanics, power, timing and software require common-cause review. Reference uncertainty can leave truth unresolved. |
| Applicable constraints | Owner-backed support/load/hold-time limits; ordinary restart, retry, reread, stop and abort permissions; guards, duration ranges and postconditions for each allowed modeled action. A documented retry command alone does not prove it succeeds in either branch. |
| Completeness and separation | All included attempts/exclusions, interruption phase and initial condition; calibration versus validation split; truth withheld from evaluated policies; hashes for source and derived records. State every omitted field and its effect. |
| Outcome definition | Capture with support, terminal supported abort, intermediate hold and unresolved outcome separately; deadline and minimum useful improvement set before comparison. Real numerical values remain UNKNOWN. |

Retention, support, contact, controller state, isolation and measured voltage
remain distinct. Isolation and voltage are outside this mechanical decision;
their omission grants no electrical permission. Retention grants no permission
to disconnect. No physical probing or load-transfer procedure is specified here.

## Adjudication and falsification

1. **Admit the claim's scope.** If identity, applicable limits or a required
   observation mapping is missing, record the exact blocked claim. Do not turn
   an inaccessible source into a failing mechanism. If an installed interlock
   excludes a branch, discard that branch and preserve the negative result.
2. **Construct joint witnesses.** For a common observed history `h`, require
   complete individually feasible trajectories with opposite retention and one
   joint assignment respecting every variable's declared scope, timestamps and
   causal ordering. Parameters declared shared must agree; persistent bias must
   stay fixed within each history. Other latent quantities may differ between
   branches where the model permits.
   At finite resolution, use the actual measurement relation and justified
   errors; do not coarsen records until they happen to match. Two archived
   traces alone do not validate a universal error envelope or fault catalogue.
3. **Separate information from action relevance.** Let `B(h)` contain all
   trajectories consistent with the admitted model and ordinary history.
   For nonempty `B(h)`, a modeled action must satisfy its guard for every
   retained state. Differing statewise permissions can make an action
   unresolved, while a common ordinary recovery still succeeds. Empty
   consistency is inconsistent; it grants nothing.
4. **Check complete continuations.** Fix the terminal set, deadline, action
   durations and disturbances first. A successful policy chooses the same
   action on every equal observed prefix and reaches the terminal set for
   every consistent trajectory while preserving support. A shared permissible
   first action is insufficient; later choices may conflict. One ambiguous
   history does not prove all future diagnostics fail. Exhaustiveness is
   required only for a declared finite no-policy claim; otherwise report
   the examined policies and leave impossibility unresolved.
5. **Try ordinary recovery first.** Give B0 its documented reread, reset,
   retry, interlocks and supported abort, with the same time and information
   as C. B1 requires actual operator evidence, not a scripted label. A hold
   is intermediate unless a separately specified terminal outcome is reached.
   If B0 satisfies the requirement, report BASELINE SUFFICIENT. A later cost
   or time hypothesis needs a predefined useful effect and a fresh comparison.
6. **Price the smallest change fairly.** Check a direct independent reading
   or a passive exclusion before a richer observer. Charge observation time,
   uncertainty, possible disturbance and integration burden. A passive change
   changes reachable states; a sensor changes available information. Compare
   B0 and C with the same channel before attributing an improvement to inference.
   A narrower belief without a useful outcome change is not a demonstrated gain.

This protocol adds no theorem. Output-history consistency and finite reach–avoid
provide the immediate tools. Only an admitted physical envelope can justify a
new finite abstraction, with a separate account of which physical behaviors it
covers. Learned belief-space control, contact simulation and subsystem
requalification remain later hypotheses tied to a specific unresolved decision.

## Next bounded work and stopping rule

The next concrete input is an **existing**, legitimately available archival
packet for one supported interface revision, containing the independent
retention reference, complete ordinary history and applicable procedure/limits.
Review it against the table before writing an importer. No hardware or outreach
is authorized by this document. At present that input is not available here.

If it becomes available, first produce a manual, source-linked admission card
and one fully checkable history pair or refutation. Only then decide whether
the existing finite checker needs a small successor. Keep originals, all null
results and the existing synthetic model immutable. Do not substitute an
unrelated large dataset merely to create a runnable benchmark.

For this continuation, no executable code changed and no new algorithm test,
physical calibration, dataset replay, statistical power analysis or comparative
performance test was run. Document checks cover local links, source versions,
unchanged earlier artifact hashes and the final worktree diff. The result is a
completed admission protocol and source triage, with the physical decision
explicitly unresolved.
