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
- `notes/2026-11-16-setup-comparison.md`: comparative review, native resume,
  current setup discovery and limits of automation/tool verification.
