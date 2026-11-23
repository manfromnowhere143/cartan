# UI checkpoint — continuous interior, 23 November 2026

Owner: this operator-assigned UI session. Branch `ui/visual-laboratory`, HEAD
`dcc8d8e` (no new commit). Common Git directory is canonical CARTAN `.git`.
Daniel's latest request explicitly moved the task into this UI worktree. The
research worktree and Engine were not changed. Setup retains launch/config/MCP
ownership; canonical setup handoff and session operations were read.

Status: local implementation complete; automated acceptance passes; rendered
browser/phone, screen-reader and performance acceptance remain blocked by browser
control failure. **Not published or deployed.** No nested session, agent, paid
job, global preference/config change, external message or new dependency.

Preserve `config/environment.json`: it was already dirty and still hashes to
`f14595ffd2f9fb435094f780dbbb9b2625c6ad47eface83ce3d838f70a6d647b`.
All other new/changed files are frontend implementation, tests, UI documentation,
QA receipts and this lane's memory. No reset/stash or sibling checkout mutation.

Read `frontend/qa/REVIEW-INTERIOR-2026-11-23.md` for the complete result/limitations,
`frontend/docs/ADR-UI-006-continuous-interior.md` for the pre-code decision,
`frontend/docs/interior-route-state-map.md` and the provenance/reference notes.
Original intake assets, media/controller wiring, hero markup, original CSS and
five frozen vendor files remain byte-identical. Scientific v1 is still pinned to
`2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a`; no later Engine findings were imported.

New: one persistent original SVG, synchronous URL-driven part/interface/evidence
selection, two text-only authored possibilities from the exact fixture, lazy
fixture verification, explicit missing geometry/limits, contextual returns and
no-JS component/uncertainty explanations. Research, comparisons and sources share
the object; vision keeps its existing separate concept image. No glass, renderer,
transition or idle motion was introduced. Normal reflow/reading scroll remains.

Actually run: 37 core Node tests; 19 serial jsdom application tests; canonical
validator with 16 negative controls; 397 release assertions; 28 preservation
checks; 25 local HTTP checks; 5 declared-color contrast calculations; JS/Python
syntax and diff hygiene. The module SVG was rendered with librsvg and inspected.
Full receipts are in `frontend/qa/interior-2026-11-23/`.

Failures retained: initial legacy presentation assertions described the replaced
photo explorer; updated to protect labeled original schematics. New round-trip
test found module selection lost on interruption defaulting; fixed. jsdom needed
structuredClone and lazy-read settlement; it is not a real browser. Chrome's
baseline opening was observed once; no filesystem screenshot was saved before
the native pipe failed. Native Chrome retry and Safari both failed. No mobile,
candidate page, real touch/keyboard/VoiceOver or performance check is passed.

Current owned loopback previews:

- Candidate http://127.0.0.1:4181/, package
  `/private/tmp/cartan-interior-candidate-20261123-final`.
- Baseline http://127.0.0.1:4180/, package
  `/private/tmp/cartan-interior-baseline-20261123`.
- Each has `/qa/interior-review.html`, unexecuted browser measurement harness.
  The source preview on 4178 was stopped. Do not kill unrelated listeners.

Package delta: +60,463 bytes (+0.206%), 29,372,996 total; still under 31 MiB.
This is static accounting, not network/device evidence. Serial local build/test
work used no cloud resources. Temporary packages are reproducible and outside Git.

Next action: restore normal browser access, inspect/capture both packages at the
named desktop/phone sizes, check real keyboard/touch/Back/Escape/zoom/VoiceOver and
fallbacks, measure equal cold-entry/reselection conditions, then fix any observed
regression. Native controls and QA source are ready; do not infer their runtime
results. Publication still requires separate operator authorization.
