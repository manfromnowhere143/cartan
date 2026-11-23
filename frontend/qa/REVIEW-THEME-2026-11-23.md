# White workspace and legibility — 23 November 2026

Successor: [UI 009 focus correction](REVIEW-FOCUS-SURFACES-2026-11-23.md) now serves
the combined candidate on port 4182. The package and results below retain the
earlier UI 008 state; they are not overwritten by its successor.

**Local candidate; browser/device acceptance remains open.** Daniel explicitly
requested a white default, a minimal appearance toggle and no gray text after
supplying a screenshot of UI 007. The screenshot is observed evidence of that
one prior desktop view. It does not justify an “absolute state of the art” claim.

Preview: http://127.0.0.1:4183/laboratory/.
Package: `/private/tmp/cartan-theme-candidate-20261123-final`.
The previous spatial candidate remains at http://127.0.0.1:4182/.
Nothing was pushed or published. Worktree/branch remain UI / `ui/visual-laboratory`,
HEAD `dcc8d8e7b6af3df797eea32fc27dc5bba187eb5e`; source changes are uncommitted.

## Result

The workspace, reading surfaces and dialog are white with near-black text by
default. A native 44px button with switch semantics selects dark appearance.
Dark surfaces use white text. The muted text palette is removed; hierarchy uses
spacing, size, weight and selected indicators. Inactive controls retain readable
text and native disabled state. SVG interface labels use the same foreground.

The approved opening and long-horizon imagery remain dark cinematic surfaces in
both themes, with white live text. Media assets, framing rules and media/dialog
behavior are unchanged. Header layout now accommodates the appearance control,
including its compact icon on small screens. Pixel layout is not yet accepted.

The explicit preference persists across routes/reloads and synchronizes across
tabs. Default light is independent of the OS color preference. A 347-byte inline
bootstrap resolves stored dark before styles; its exact hash is allowlisted by
CSP without unsafe-inline or another blocking request. This establishes source
ordering, not an observed flash-free browser paint. Invalid/blocked storage stays
usable. No-JS defaults to light and hides the inactive switch. Forced colors keep
system colors and the SVG fallback. No theme animation or page wipe is added.

Selection now changes the selected geometric surface clearly: graphite on white,
pale on dark. SVG and GPU receive the same palette choice. The selected-part name
and a plain explanation sit below the object, outside its geometry. All mesh
coordinates, normals and part relationships match UI 007 exactly. The visual
version is `spatial-schematic/1.1.0`; it remains an explanatory schematic with
unverified geometry, not engineered hardware or a physical-state reconstruction.

Decision and primary sources: [UI 008](../docs/ADR-UI-008-light-and-legibility.md).
The existing [route/provenance map](../docs/spatial-instrument-map.md) remains valid
for scientific state; appearance is an independent presentation preference.

## Checks actually run

Receipts are under `theme-2026-11-23/`.

| Check | Result |
| --- | --- |
| Core Node | **50 passed**. Existing contracts/media/routes, mesh and projection; explicit default, bootstrap, semantic text palette, palette-only projection and GPU uniform reuse. `core-tests.tap` |
| Application DOM / lifecycle | **41 passed**, including saved theme on all eight direct paths, repeated switching, focus/history/reading preservation, user-paused media, blocked storage, cross-tab filtering, assistive-style activation and hidden-scene suspension. `dom-tests.tap` |
| Frozen contract | **Valid; 16 negative controls rejected.** Scientific validation false. `contract-verification.json` |
| Release package | **475 assertions passed**, including per-path light default, one theme metadata record, switch semantics, pre-style bootstrap, CSP hash and shared 404 appearance. `package-verification.txt` |
| Preservation | **28 passed**: assets/controllers/pin/vendor, hero markup, media wiring and setup file. Original CSS differs only by explicitly requested palette/focus/text-opacity substitutions; new theme CSS adds the switch/layout and appearance behavior. `preservation.json` |
| Geometry preservation | Joined and separated meshes match the previous retained package exactly. `mesh-preservation.json` |
| Local HTTP | **18 passed**: all routes, selected query, theme CSS/module bytes, QA harness, private/unknown 404s and exact 1,024-byte media range. `local-http.json` |
| Text/focus contrast | Declared solid pairs: **18.48:1** light, **19.94:1** dark, **20.52:1** on the opaque cinematic background. `contrast.json`. Not rendered-image contrast or a WCAG certification. |
| Drawing inspection | Actual generated light/dark interface SVGs and a 320-wide drawing rendered by librsvg and visually inspected. These are **drawing renders, not browser/phone screenshots**. `light-interface.png`, `dark-interface.png`, `light-narrow.png` |
| Syntax and diff hygiene | Node syntax, Python parsing and `git diff --check` passed. No dependency installed. |

The input capture's source/hash pointer is retained in `user-capture.json`.
Its browser chrome includes unrelated personal context, so the full screenshot
was not copied into the repository or package. No invented after screenshot is
substituted for the unavailable browser.

## Size and performance limits

Package **29,508,412 → 29,522,415 bytes**, +14,003 (**0.0475%**).
Home HTML **43,021 → 43,823 bytes** (+802). New theme CSS is 3,869 bytes; its
controller 1,723; inline bootstrap 347. Scene code totals 18,331 bytes, retaining
484 triangles and the existing canvas/DPR/pixel bounds. No new image, model,
texture, font, framework or scene request on initial hero entry was added.
These are source/package counts, not transferred bytes or browser timing.

The small initial CSS/module cost provides the requested appearance controls;
the head bootstrap avoids a separate blocking network dependency. No speed or
GPU-efficiency improvement is claimed. Baseline/candidate browser transfers,
interaction latency, long tasks, frame presentation/drops and battery/device
performance remain unmeasured. Named local machine remains Apple M1 Pro,
MacBookPro18,1, 16 GiB, macOS 14.4; no phone or field benchmark was run.

## Not run

One new browser inventory attempt still returned no usable apps/tabs:
`Sky Computer Use native pipe startup failed` and `The browser access host is
unavailable`. No settings, launchers or permissions were changed to bypass it.

- Actual Chromium/Safari layout, prepaint flash, storage/private-mode behavior,
  CSP enforcement, native switch keyboard interaction or GPU shader compilation.
- New desktop, 390px, 320px or landscape page captures; native touch, hover absence,
  Back/Forward, rapid input, zoom/reflow and focus occlusion in a browser.
- VoiceOver or any actual screen reader. DOM activation and ARIA checks are simulated.
- Rendered JS-disabled, forced-color, reduced-motion, missing-media, optional-GPU
  failure and stylesheet-failure views. Their code/static/DOM paths were checked.
- All device/field performance, full non-text contrast and full accessibility acceptance.

The current harness is http://127.0.0.1:4183/qa/interior-review.html. It is excluded
from the release package and has not been executed in a browser this turn.
Its default profile is local/unthrottled. The optional slow profile is explicitly
approximate server pacing, not a device model.

## Resume

Run the existing Node suite and the four QA DOM files (`focus-dom`, `interior-dom`,
`spatial-dom`, `theme-dom`) serially with the existing QA-only jsdom installation.
`render-theme.mjs --update-static` intentionally regenerates the current fallback;
the old `render-spatial.mjs` now refuses to overwrite historical UI 007 receipts.
Build into an empty directory, run the package verifier, and start the owned
loopback preview with `--report-dir theme-2026-11-23`.

Next acceptance work is real browser/mobile/AT inspection and matched performance
runs. The theme is implemented; exceptional visual quality remains something to
demonstrate through those reviews, not a conclusion from choosing newer APIs.
