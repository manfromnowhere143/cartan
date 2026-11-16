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
