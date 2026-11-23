# Repository integration review — 23 November 2026

Candidate on `research/architecture`. The current user explicitly requested the
repository, README, diagrams and lane work brought up to date and merged. The
existing public target is `manfromnowhere143/cartan`, branch `main`. No website
release, external message, model session or global setting change is part of this
block. Sibling checkouts remain untouched.

## Completed integration addendum

This supersedes the interim UI-pending and publication-pending statements below.
`9a4a2ee` reached GitHub main and passed exact SHA/README readback
([receipt](remote-readback.json)). The UI owner subsequently completed its spatial
checkpoint. Its 68 owned files were copied and hash-checked before and after into
an isolated Git index, without changing its worktree, index or branch. The
immutable result is `c5657e7`, parent `dcc8d8e`, on
`integration/ui-spatial-20261123`; [snapshot receipt](ui-snapshot.json).
Only the memory-index union conflicted during merge; both lanes' links remain.
The subsequent UI README status correction is documentation only.

Independent rerun: **45 core Node tests, 31 DOM tests, 424 package assertions
pass**. The built release manifest equals the owner's manifest byte for byte in
its serialized contents: 36 shipped files, 29,508,412 bytes. No new dependency was
installed. An initial attempt with existing jsdom 16.7.0 failed 22/31 tests because
its DOM support is too old for the harness; repeating with existing 26.1.0 passed
31/31. Both logs are retained. This is a QA prerequisite, not a runtime dependency.

[Browser results](browser/results.json) and captures record installed Chrome
158.0.8127.36, default headless graphics on ANGLE/Apple Metal, successful WebGL2
draw with GL error zero, the complete part/interface/interruption/evidence/return
sequence, keyboard orbit, explicit SVG fallback, reduced-motion selection and no
additional scene draws during a 500 ms idle sample. There were no page errors.
Widths 1440, 1280, 390, 320 and 844 and a no-JavaScript static view were inspected;
the tested document widths have no horizontal overflow. The first probe wrongly
expected an already-separated diagram to remain separated after toggling; the
corrected assertion checks both toggle directions. Application source was unchanged.

The captured fixed bottom navigation covers some content at narrow/landscape
viewports; scrolling/focus/occlusion needs further UI acceptance. This is not a
claim of finished device UX. Safari, physical phone/touch, AT, forced-color pixel
review, sustained-use and performance acceptance remain open. No hosting headers
are reproduced by the loopback server. The owner review remains a historical
pre-browser record; this addendum supplies the later, narrower observation.

All scientific findings and frozen contract bytes remain unchanged. Source
integration is authorized; this block performs no website deployment. Setup's
Codex version mismatch below is still unresolved and visible in README/handoff.
The [final checkpoint](../../../memory/checkpoints/research-20261123-integration-complete.md)
and [final checks](final-checks.json) identify the continuation state.
The merged source reached main as `b879dbc` and passed
[exact remote readback](ui-publication-readback.json) at 10:32 UTC. Source hygiene
passes excluding the two raw `implementation.patch` receipts, whose blank diff
context lines are intentionally preserved rather than reformatted.

## Earlier integration stage: history and preservation

- Research `41ff839` retains the fixed retention fixture, decision memo and REA-1.
- Published main `940d8f1` was merged without rewriting history; it already contains
  UI `dcc8d8e` and the historical matched-opening release.
- Setup `70456b0` was merged as `75509aa`. Its launcher and full-access profile
  match the setup owner's source. README/memory conflicts retained both lanes'
  substance. The existing published-origin config bytes are now committed.
- The UI worktree is still changing toward a spatial-instrument successor; no
  moving snapshot is certified or integrated. Its earlier receipts do not validate
  that successor. An immutable ready revision remains an integration dependency.

[Preservation checks](preservation.json) confirm 67 pre-existing scientific
implementation/contract/evidence files unchanged, all five frozen v1 files
identical to `2a4083a` and the vendor copy, and launcher bytes identical to setup.
The only setup-code correction is the temporary test fixture's expected remote
plus missing/wrong-remote controls. No launch policy or client pin changed.
Two old copied-engineering document links now point to canonical research files.

## Executed checks and exceptions

The [command receipt](checks.json) retains commands, durations, hashes and concise
outcomes, including failures. Full disposable logs are under
`/private/tmp/cartan-integration-20261123-oyam36cb/`.

- Scientific unit suites: 12 exchange, 12 certificate, 11 interface and 11
  observation tests pass (46 total).
- Frozen contract: valid; all 16 negative controls rejected.
- Retention: seven independent controls pass; producer/replay bytes match SHA-256
  `f32db1581a8d0e335a75870b6f943058b92ca021e29ef1d4a776b5c6a0850c72`.
- Environment: the first 32 tests all errored because the temporary repository
  omitted the now-pinned origin. The corrected fixture executes 34 tests with
  seven errors from Codex version drift: installed 0.171.0 versus pinned 0.169.0.
  Claude's version matches. The version gate remains intact; setup review is open.
- README: four diagrams render with existing Mermaid/Chrome; sources, accessible
  descriptions, local layouts, contrast and static links are separately retained
  in [presentation QA](../readme-20261123/REVIEW.md).

The setup suite runs from an immutable tracked export plus the inspected test
correction, so ignored source-paper downloads never enter its temporary Git
fixture. Test execution does not start inference. No hardware, physical fault
coverage, flight, human-operator or comparative-performance acceptance is claimed.

Publication/readback and an eventual UI integration are recorded separately when
actually completed. Until then, neither a clean full merge nor universal launch
readiness is claimed.
