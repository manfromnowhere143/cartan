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
- [Continuous interior candidate](checkpoints/ui-20261123-continuous-interior.md):
  earlier UI 006 state, preservation, local preview, exact automated results and the
  unresolved browser/phone/accessibility/performance acceptance. Not published.
- [Spatial instrument candidate](checkpoints/ui-20261123-spatial-instrument.md):
  earlier UI 007, following Daniel's explicit 3D direction; same-mesh optional
  renderer, canonical camera/selection, exact checks and still-open browser/GPU
  acceptance. Former preview 4182 replaced by UI 009; package retained, not published.
- [White workspace and contrast](checkpoints/ui-20261123-white-workspace.md):
  UI 008; default light, saved native switch, no muted text, clearer
  selection; user screenshot reviewed, browser bridge still unavailable. Preview
  4183 and exact checks; not published or device-accepted.
- [Shared scene focus](checkpoints/ui-20261123-scene-focus.md): latest UI 009,
  integrates the custom viewport into shared pointer/keyboard focus and fixes
  interrupted capture. Includes UI 008 appearance; combined preview now on 4182.
  Exact automated receipts; browser/device acceptance still open. Not published.
