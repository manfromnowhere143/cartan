# UI checkpoint — shared scene focus, 23 November 2026

Owner: current UI session. Branch `ui/visual-laboratory`; base
`dcc8d8e7b6af3df797eea32fc27dc5bba187eb5e`; uncommitted. Successor to
`ui-20261123-white-workspace.md`, preserving its appearance and research findings.

Daniel's screenshot and report identify a scene-wide pointer focus rectangle.
The existing shared handler omitted the custom viewport. ADR UI 009 precedes the
fix: explicit custom surface registration, shared pointer policy, retained native
focus and keyboard indicator, forced-color preservation. Also repaired an
unexpected-capture-loss camera commit and cleared stale provenance on window blur.

Files: `focus-presentation.mjs`, viewport marker in `index.html`, keyboard selector
in `interior.css`, drag lifecycle in `spatial-scene.mjs`, new focus-surface DOM
regressions, presentation/package assertions, docs and QA receipts. No engine,
fixture, schema, evidence, media asset or setup changes. Pending environment hash:
`f14595ffd2f9fb435094f780dbbb9b2625c6ad47eface83ce3d838f70a6d647b`.

Read `frontend/qa/REVIEW-FOCUS-SURFACES-2026-11-23.md` and
`frontend/docs/ADR-UI-009-scene-focus.md`. Receipts/diff:
`frontend/qa/focus-surfaces-2026-11-23/`. 50 core tests, 45 application DOM tests,
483 package assertions, 16 negative controls, 32 preservation and 21 HTTP checks
passed. Before regression retained. Package +678 bytes from UI 008; no timing claim.

**Current preview is Daniel's existing port 4182**, now the combined UI 009 package:
`/private/tmp/cartan-focus-theme-candidate-20261123`.
http://127.0.0.1:4182/laboratory/?camera=interface&layout=separated.
The owned old UI 007 server was stopped; its package remains retained. UI 008 on
4183 is historical. Baseline 4180 remains. New loopback exec session 92616.

No publication/push/deploy/DNS/outreach, paid work or nested agent. Actual browser
host remains unavailable. No after browser/phone capture, native touch/keyboard,
VoiceOver, GPU compile, reflow/zoom/forced-color render or device/performance
acceptance claimed. User screenshot is one real before observation. Next action
is browser acceptance against this exact package when the host is available.
