# Scene focus correction — 23 November 2026

**Combined local candidate UI 009. Actual browser acceptance remains open.**
Reload http://127.0.0.1:4182/laboratory/?camera=interface&layout=separated.
This replaces the earlier UI 007 preview at the same address and includes all
UI 008 white-default / saved-dark / full-contrast-text changes. The approved
opening framing, film and media controls remain. No publication occurred.

Package: `/private/tmp/cartan-focus-theme-candidate-20261123`.
Branch `ui/visual-laboratory`, base `dcc8d8e7b6af3df797eea32fc27dc5bba187eb5e`;
local changes remain uncommitted. Loopback server serves exact verified bytes
with `Cache-Control: no-store`. Existing loaded documents need a reload.

## Finding and correction

Daniel's 12:45 screenshot shows the scene-wide rectangle; he reports that it
persists until clicking elsewhere. Source inspection found that the shared
pointer-focus handler omitted the new focusable scene. The viewport could
therefore retain `:focus-visible` styling after pointer interaction. An isolated
DOM regression reproduced the missing marker before the fix; it now passes.
This establishes the code defect and correction, not a fresh browser screenshot.

The viewport now opts into the same focus policy as all existing native controls
and reading tables. Nested SVG and canvas targets resolve to the viewport.
Pointer focus keeps its actual location without the decorative rectangle.
Keyboard use restores visible indication immediately, even without a focus move;
assistive-style activation clears pointer presentation. There is no `.blur()`,
global outline removal, prevention of native focus, or tabindex removal.
Forced colors continue to preserve focus indicators. Native editing and media
controls stay outside pointer-outline suppression.

The audit also reproduced an interrupted orbit committing after unexpected
pointer-capture loss. Capture loss now abandons that transient movement and
restores the URL camera. Normal release still commits once. Window blur clears
pending pointer provenance so a later assistive-style click is not misclassified.
No camera layout, geometry, scientific state or route contract changed.

Decision, sources and rejected alternatives:
[UI 009](../docs/ADR-UI-009-scene-focus.md).
Appearance decision and drawing comparisons:
[UI 008 review](REVIEW-THEME-2026-11-23.md).
Route/selection, schematic provenance and resource bounds:
[spatial map](../docs/spatial-instrument-map.md).

## Results

Receipts: `focus-surfaces-2026-11-23/`.

| Check | Result |
| --- | --- |
| Before regression | Three failures reproduced: viewport pointer marker absent; abandoned drag could commit; custom viewport missing shared policy. `regression-before.tap` |
| Core Node | **50 passed**. Routes, pinned adapter, media, projection, lifecycle, theme and focus CSS contract. `core-tests.tap` |
| Actual application modules in isolated DOM | **45 passed**. Includes full laboratory → component → interface → interruption → evidence → return, rapid reselection, URL/history, Escape, media pause, theme and storage paths. Four new focus-surface cases cover both themes, nested geometry, keyboard after pointer, gesture cancellation, capture loss, custom-tab-stop inventory and native-input exclusions. `dom-tests.tap` |
| Pinned contract | **Valid; 16 negative controls rejected.** Scientific validation remains false. `contract-verification.json` |
| Static release | **483 assertions passed**. Eight crawlable paths, aliases, unique metadata, no-JS content, CSP, allowlist, real 404, appearance bootstrap and scene focus contract on every path. `package-verification.txt` |
| Served candidate | **21 HTTP checks passed** on port 4182: eight paths, exact supplied query, exact appearance/focus/controller bytes, QA profile, private/unknown 404s and a byte-exact media range. `local-http.json` |
| Preservation | **32 checks passed**. All retained assets/vendor data, hero controller/markup, adapter/pin and unrelated setup file; app/media wiring, theme colors and mesh/GPU geometry unchanged from UI 008. UI 009 HTML change is only the focus marker. `preservation.json` |
| Contrast and drawings | UI 008 palette/drawings unchanged. Declared contrast remains 18.48:1 light, 19.94:1 dark; generated light/dark/narrow SVG projections were inspected previously. These are not browser captures or full WCAG acceptance. |
| Hygiene | `git diff --check`, Node syntax and Python parsing pass. No dependency installation or global configuration edit. |

The supplied screenshot's source/hash is in `user-capture.json`. Its personal
browser chrome is not copied into the repository or release. There is no invented
after screenshot. `source-receipt.json` binds the candidate to its code hashes;
`implementation.patch` contains the complete UI candidate diff, excluding setup
changes and dated raw QA receipts.

## Performance and remaining acceptance

Focus correction adds **678 package bytes**, from 29,522,415 to **29,523,093**.
Home HTML adds 19 bytes. No new asset, import, dependency, idle animation or
rendering pass. These are package counts, not measured transferred bytes, latency,
long tasks or dropped frames. Hardware remains the local Apple M1 Pro /
MacBookPro18,1 / 16 GiB / macOS 14.4; CPU and local HTTP are unthrottled.

The existing browser bridge still has no usable app/browser host, as documented
in UI 008. No settings were changed to bypass it. **Not run:** actual Chromium or
Safari focus rendering and pointer capture; 390/320 CSS px and landscape layouts;
native touch; actual screen reader/VoiceOver; zoom/reflow and focus occlusion;
rendered no-JS/reduced-motion/forced-color/missing-media/GPU-failure views; real
GPU shader compilation; matched cold-entry/reselection performance or any device
or field benchmark. Event dispatch, native dialog autofocus and media in jsdom are
modelled, not physical device tests. Browser support is not inferred from specs.

Next acceptance: use `/qa/interior-review.html` plus native interaction inspection
when browser access returns. Confirm clicks/drags leave no persistent rectangle,
Tab/arrows retain a visible indicator, and the eight-route theme/fallback matrix
works in actual Safari and Chromium. Ambitious visual quality remains a review
target; these receipts do not establish institutional approval or superiority.
