# Current state and discrepancy audit

Inspected 16 November 2026, before product changes. Owner: research.
Starting commit: `f0d2767cbb0f727acb5a64ba84050c92f1dc0d84`.

## Actual environment

The cwd and Git root are `/Users/danielwahnich/workspace/cartan-worktrees/research`,
branch `research/architecture`; common directory is
`/Users/danielwahnich/workspace/cartan/.git`. Status, including untracked files,
was clean. No remote exists. Configured author and committer are Daniel Wahnich;
the identity is preserved. The setup and UI worktrees are distinct and initially
point to the same commit. Read-only inspection of UI status and history at
09:42 UTC found no pending changes or new commits. This does not establish that
the UI session is idle, or that it has consumed a handoff. No session was attached
to, interrupted or started.

The setup handoff and verification report exist and were read. Their recorded
launcher checks are setup evidence, not checks rerun here. The current process
inventory contains several existing Codex/Node/Python jobs and a development
server; process names alone do not identify ownership. Processes were left alone.
`ps` and installed-memory inspection initially failed under the sandbox, then
succeeded through the approval mechanism. Installed RAM is 17,179,869,184 bytes;
`vm_stat` shows substantial compressed memory. Available filesystem space was
about 61 GiB. This motivates serial, small work, not parallel simulation/builds.

Python and Poppler are available. Pillow is not installed; an optional contact
sheet command failed with `ModuleNotFoundError`. No dependency was installed to
resolve it. Instead, all 4 appendix and 7 deck pages were rendered with Poppler
and individually inspected. PASS's public DOCX was text-extracted; no layout or
equation-rendering certification of that manuscript is claimed.

## Input recovery

All 12 files in `config/inputs.json` match both SHA-256 and byte count. The complete
local reading list, assigned backend prompt, READ-FIRST audit, v3, prior-art
ledger, Gemini source audit, v2, both November 15 PDFs and visual-laboratory
mission were read. The setup report was read as the launch authority. Originals
remain outside Git and unchanged. The full Gemini transcript, separate opportunity
reassessment, complete historical investigations, original-paper archive,
restricted interface manuals, editable geometry and films remain absent from the
recovered packet. No broad home-directory or sibling-project search was performed.
Setup records a candidate logo path, but approval and rights remain for UI intake.

## Reconciliations

| Discrepancy | Controlling decision |
|---|---|
| Older audit says the Mac is offline | Historical only; this session verified local paths and hashes |
| v2 and visual mission call November 14 PDFs latest | Use the hash-matched November 15 artifacts; preserve old references as history |
| Appendix p. 2 requires baseline inability to recover safely | Superseded by v3: useful time, intervention or cost improvement at accepted safety may count |
| Earlier prompt asks research to prepare launchers | Latest execution update reserves all launch/global/MCP work to setup |
| Visual attach/isolate/remove order | Illustration only; reviewed transition guards govern research |
| Prior packet only read PASS abstract | Public V14-updated manuscript now retrieved; §§II, IV–VI read for methods and limits |
| HOTDOCK abstract and SPACE USB geometry wording disagree | Do not infer exact symmetry or reproduce a vendor mechanism from these summaries |
| Broad recovery/uncertainty novelty | Substantial prior methods exist; no novelty claim is available from this search |
| Historical industry status and launch prices | Preserve as attributed historical audit material; omit from this first model's premises |

## Ownership and authority

`docs/COORDINATION.md` remains controlling. Research owns `research/`, `backend/`,
`contracts/cartan/v1/` and its uniquely named memory checkpoints. UI owns its own
frontend checkout and asset intake. Setup owns `scripts/`, `config/`, `.codex/`,
`.claude/`, launchers and global settings. Root manifest integration has not been
handed over; this block needs no root manifest or lockfile. UI receives committed
contracts via `git show`, not mutable research files. No merge into UI is implied.

The operator's active instructions authorize source research, explicit decisions,
static contracts and safe bounded local computational work. Physical operations,
paid jobs, external messages, account changes, publication and deployment remain
outside this block. No new service or nested model is needed.
