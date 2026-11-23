# CARTAN memory

Read `../docs/SESSION_HANDOFF.md` and `../docs/COORDINATION.md` first. Search notes
with `rg` before repeating work. Native client memory may help discovery but is
not the project's source of truth.

Use `notes/<UTC>-<topic>.md` for durable findings and
`checkpoints/<lane>-<UTC>-<topic>.md` for resumable work. Each record names its
owner, branch, source commit/artifacts, status, evidence scope, limitations and
next action. Corrections add a successor naming the superseded note. Do not
overwrite another session's history or copy raw transcripts and credentials.

Records are ordinary versioned files, local to each worktree until merged.
No writable sibling MCP memory service, custom memory server or paid embedding
index is installed. Add infrastructure only after an actual requirement justifies
its lifecycle, privacy and maintenance cost.

- `notes/2026-11-16-environment-decisions.md`: setup boundaries and architecture.
- [Frozen research contract v1](checkpoints/research-20261116T095000Z-contract-v1.md):
  contract commit, hash manifest, validator and UI consumption rules.
- [Research verification block](checkpoints/research-20261116T101534Z-verification.md):
  source/evidence commits, executed checks, limits, gaps and next study.
- [Evidence comparison and certificates](checkpoints/research-20261116T115404Z-certificates.md):
  new primary sources, B0/C null result, conditional mathematical checks and verified
  UI contract consumption. Supersedes the earlier access/consumption gaps in part.
- [Interface evidence and research front page](checkpoints/research-20261116T122500Z-interface-readme.md):
  six distinct propositions, witnesses and report gates; frozen study/replay;
  root README, rendered Mermaid diagrams and immutable UI handoff. Earlier models
  and their evidence remain unchanged.

[Physical observation and local integration](checkpoints/research-20261116T130843Z-observation-integration.md) records
block 4, the expanded prior-art review, README revision, verified UI merge and
pending GitHub license/visibility choices. It supersedes the block 3 current-state
summary while preserving its evidence.

[Verified GitHub publication](checkpoints/research-20261116T134432Z-github-publication.md) records the public
repository, Apache-2.0 scope, immutable first publication commit, remote readback
and browser-review limitation. It resolves the prior pending publication choices.

[Post-publication continuity check](checkpoints/research-20261116T134817Z-continuity-check.md) confirms
research/GitHub synchronization and clean worktrees, and records the newer UI
commit that still needs review and integration into the public main branch.

[Interrupted capture decision, 23 November](checkpoints/research-20261123T094107Z-retention-decision.md)
records the reconstructed architecture, fresh checks of retained results and a
small independent synthetic-history check. Ordinary retry and supported park
suffice within that fixture; physical decision relevance remains unestablished.
Its local-ref audit supersedes the earlier pending UI integration statement.

[Evidence admission continuation](checkpoints/research-20261123T095702Z-evidence-admission.md)
records the targeted newer-method review, public archive triage and REA-1 offline
admission protocol. It preserves the synthetic baseline result and identifies the
physical records needed before another model is justified. No physical study began.

- `notes/2026-11-16-setup-comparison.md`: comparative review, native resume,
  current setup discovery and limits of automation/tool verification.
- `notes/2026-11-16-full-access-correction.md`: Daniel's explicit YOLO/full-access
  requirement, effective launch options and supersession of restricted defaults.
