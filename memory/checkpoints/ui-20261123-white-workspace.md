# UI checkpoint — white workspace and contrast, 23 November 2026

Owner: current UI session. Branch `ui/visual-laboratory`, HEAD
`dcc8d8e7b6af3df797eea32fc27dc5bba187eb5e`; same CARTAN common directory. Uncommitted.
Successor to `ui-20261123-spatial-instrument.md`. Daniel supplies a real screenshot,
challenges the design standard and explicitly asks for default white, a minimal
dark toggle and no gray text. This authorizes replacing the earlier palette;
research/fixture and media-framing boundaries remain.

Implemented native light/dark appearance, early hash-authorized preference
bootstrap, persistent/cross-tab choice and storage failure fallback. Live text
uses near-black on white or white on dark. Cinematic media planes remain dark,
with white text. Header gains a minimal switch. Mesh selection has distinct light
and dark palettes; the same geometry and camera remain. Selected-part explanation
now sits below the object instead of a cryptic corner code.

Read `frontend/docs/ADR-UI-008-light-and-legibility.md` and
`frontend/qa/REVIEW-THEME-2026-11-23.md`. New code: `theme.mjs`, `theme.css`;
modified app/head/semantic colors, renderer palette, release CSP/allowlist and QA.
The original CSS preservation exception is audited: only requested palette,
focus and text-opacity substitutions changed that file. Assets, hero markup,
controllers, media/dialog wiring, scientific adapter/pin/vendor files stay intact.
Setup-owned environment SHA-256 remains
`f14595ffd2f9fb435094f780dbbb9b2625c6ad47eface83ce3d838f70a6d647b`.

Exact receipts, drawings and diff: `frontend/qa/theme-2026-11-23/`.
Results: 50 core Node tests; 41 DOM/lifecycle; 475 package assertions;
16 contract negative controls; 28 preservation; 18 HTTP; mesh equality;
declared text contrast 18.48:1 light and 19.94:1 dark. Tests do not establish
device performance, scientific validity or exceptional visual quality.

Current package `/private/tmp/cartan-theme-candidate-20261123-final`, loopback preview
http://127.0.0.1:4183/laboratory/. Previous UI 007 stays on 4182. No publish/push,
deploy, DNS, setup edit, Engine import, external message, paid work or new agent.

The user's old-view screenshot is visually inspected; a source/hash pointer is
retained without copying unrelated personal browser chrome into Git. Current
light/dark/narrow drawing projections were rendered with librsvg and inspected.
They are not page screenshots. One fresh CUA inventory failed with the same
native-pipe and browser-host errors; no settings changed to work around them.

Missing: real Chromium/Safari/new page captures, native keyboard/touch, actual
screen reader, zoom/reflow, forced-color/media/no-JS rendered fallbacks, GPU
compile and browser/device/field performance. Next: run that acceptance matrix
against retained packages when browser access returns. Native color-scheme and
switch guidance was checked against W3C/WAI; scoped transitions were reviewed and
not selected for this use case. No claim of exhaustive research, Nolan approval,
NASA/SpaceX endorsement or comparative UI superiority is warranted.
