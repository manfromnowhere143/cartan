# Spatial instrument candidate — 23 November 2026

**Local implementation complete; browser, GPU and device acceptance open.**
This succeeds the UI 006 visual direction following Daniel's explicit request for
a much more ambitious 3D workspace. It is not published or a claim of superiority
to another instrument. UI branch `ui/visual-laboratory`, baseline `dcc8d8e`.

Preview: http://127.0.0.1:4182/ — enter Laboratory.
Direct study: http://127.0.0.1:4182/laboratory/.
Drawing fallback: http://127.0.0.1:4182/laboratory/?render=drawing.
Package: `/private/tmp/cartan-spatial-candidate-20261123-acceptance`.
The loopback-only server remains running for review. Baseline remains on 4180;
the earlier UI 006 candidate remains on 4181. These are local artifacts.

The object now dominates one workspace. Function selection brings its relevant
side into view; native controls also expose perspective, interface and profile,
diagram separation, drawing fallback and notes. The compact reading surface
retains research, interrupted-state inspection and evidence in place. Dragging
or keyboard orbit changes the viewing camera only. Larger viewing changes cut;
smaller reveals cancel on newer input. The approved opening is unchanged.

Read [the decision](../docs/ADR-UI-007-spatial-instrument.md) and
[state/provenance map](../docs/spatial-instrument-map.md). No engine, fixture,
schema, published evidence, setup/global configuration or sibling was edited.
The existing launcher repair remains byte-identical. No dependencies installed.

## Checks actually completed

All receipts below are in `spatial-2026-11-23/`.

| Check | Result |
| --- | --- |
| Core Node tests | **45 passed**: existing media/contract/routes, camera URL bounds, whole-object framing across aspect ratios, geometry/picking and static SVG identity. `core-tests.tap` |
| Application/lifecycle DOM checks | **31 passed**: 10 existing focus/media, 9 sequence/history/error checks, 12 new spatial checks. `dom-tests.tap`. Actual application modules run in jsdom; optional renderer lifecycle also uses an explicit mock. |
| Laboratory → part → interface → paused transfer → evidence → return | Passed in application DOM, including pinned fixture verification, unchanged scene node, focus restoration, late evidence, reselection and Escape. Browser interaction remains unverified. |
| Context loss / slow import / cancellation | Passed with API and renderer mocks: no late allocation after exit, immediate drawing fallback, no idle RAF, latest camera wins, context restoration required to reallocate. This does not compile a shader or exercise a GPU. |
| Frozen scientific contract | **Valid; 16 negative controls rejected**, scientific validation false. `contract-verification.json` |
| Release package | **424 assertions passed**, eight crawlable static paths, unique metadata, aliases, allowlist and real 404 configuration. `package-verification.json`, `release-manifest.json` |
| Local delivery | **19 HTTP checks passed**: paths/query, correct lazy module bytes/MIME, missing/private 404s, QA harness and exact media range. `local-http.json`. Hosting headers are inspected in the package, not reproduced by this preview. |
| Preservation | **28 checks passed**: original CSS, controllers, assets, hero markup, media/dialog wiring, frozen v1 files and launcher repair. `preservation.json` |
| Declared text/focus contrast | **7 pairs passed**, minimum 8.35:1 against the opaque background. `declared-color-contrast.json`. Not rendered pixel, all non-text contrast or WCAG acceptance. |
| Drawing inspection | Joined, separated and narrow-aspect SVG projections rendered through librsvg and inspected; final separated drawing inspected again after size optimization. PNGs/SVGs are drawings, **not browser or phone screenshots**. |
| Syntax/hygiene | Node checks, Python parse, `git diff --check`; no production dependency added. |

Implementation review and tests corrected SVG visibility handling, partial GPU allocation cleanup,
floating-point endpoint drift, view-context loss and hidden-scene revival.
They also exercise the no-graphics paths; no missing source was replaced with
plausible values. No scientific result is inferred from a UI check.

## Resource result and regression

Machine: MacBookPro18,1 / Apple M1 Pro / 16 GiB / macOS 14.4 (23E214).
Node v20.18.3. Local CPU/network unthrottled. No physical phone tested.

Lazy scene source totals **17,573 bytes**: geometry 6,080; controller 7,197;
WebGL 4,296. There are **484 triangles**, one optional canvas, DPR cap 1.5 and
1,800,000-pixel cap. GPU code is skipped for save-data, forced colors, missing
WebGL2 or explicit drawing mode. Reduced motion retains rendering but cuts
immediately. The no-idle and allocation bounds passed mocked lifecycle tests.

Static package: **29,312,533 → 29,508,412 bytes**, +195,879 (**0.668%**).
Versus UI 006: +135,416. Initial HTML is **24,366 → 43,021 bytes** versus the
original checkout (UI 006 was 29,906). This is a real cost: an inspectable static
fallback is embedded in the eight prerendered documents. Shared SVG attributes,
compact colors and coordinate encoding removed 74,817 bytes from the first
spatial package without changing the mesh. The remaining cost buys no-JS geometry
and a complete static reading path; it is not claimed as a speed improvement.

No new scene module or external image/model/font is requested on initial hero
entry in the application DOM check. The inline fallback still adds HTML bytes.
Static sizes are **not transferred-byte measurements**. All accounting is in
`package-comparison.json`; every shipped module is tied to the release manifest.

**Not measured:** cold-entry transferred bytes, actual input/interaction delay,
GPU draw time, presented/dropped frames, long tasks, LCP/INP/CLS, energy use and
repeated-selection device performance. No Node timing or mock frame count is
substituted. The enhancement's visual advantage over SVG is still an acceptance
question, not a measured result.

The retained `/qa/interior-review.html` harness records local ResourceTiming,
click-to-next-rAF samples, available long tasks, actual feature probes and the
scene's reported renderer. It has **not been executed in a browser**. The optional
server `--profile slow` is 40 ms/request and 1 MiB/s body pacing with unthrottled
CPU, not a mobile device/network model. No throttle result is claimed.

## Missing acceptance and captures

Both browser and native-app bridges remain unavailable. This turn's inventory
returned no usable surfaces and the errors `The browser access host is
unavailable` / `Sky Computer Use native pipe startup failed`. Earlier native
Chrome exposed one baseline opening frame; the rest of that failure history is
retained in [UI 006 review](REVIEW-INTERIOR-2026-11-23.md). No browser flags,
permissions or launch settings were changed to work around it.

The following are **not run**, and block a claim of visual completion:

- Real Chromium and Safari GPU compilation, layout and runtime support probes.
  Prior Chrome binary observation was 157.0.8103.51; this candidate was not run
  there. Installed Safari version/support was not established.
- Opening/laboratory/state/evidence before/after browser captures, including
  1440×900, 1280×720, 390×844, 320×740 and landscape 844×390. Retained source HTML
  and generated drawings do not replace them.
- Actual keyboard traversal/focus visibility, native touch without hover,
  Back/Forward, rapid selection/Escape, zoom/reflow and header/panel occlusion.
  Only the specified DOM/model versions passed.
- VoiceOver or another actual screen reader. Synthetic assistive activation is
  not an AT session. Native media-dialog behavior is modeled in jsdom.
- Rendered reduced-motion, forced-color, missing-media, JS-disabled and
  graphics-disabled views. No backdrop filter exists in this candidate; its
  text surface is solid. Static/DOM fallbacks were checked, not their pixels.
- Physical phone, field, battery, sustained-use or full accessibility acceptance.

Reiyah was studied from its real local implementation and two bound historical
captures. Sentinel/Nisayon source inspections and primary browser standards are
recorded in the reference review and UI 007. These are not fresh live-site tests
or endorsements.

## Reproduce / resume

```sh
node --test --test-concurrency=1 frontend/tests/*.test.mjs
CARTAN_JSDOM_MODULE=/path/to/existing/jsdom node --experimental-vm-modules --test --test-concurrency=1 frontend/qa/focus-dom.test.mjs frontend/qa/interior-dom.test.mjs frontend/qa/spatial-dom.test.mjs
python3 frontend/vendor/cartan/v1/validate.py frontend/vendor/cartan/v1/fixture.json --self-test --manifest
python3 frontend/release/build_site.py /private/tmp/cartan-spatial-new-review
python3 frontend/release/verify_package.py /private/tmp/cartan-spatial-new-review
python3 frontend/qa/interior_server.py /private/tmp/cartan-spatial-new-review --port 4182 --report-dir spatial-2026-11-23
```

Use an empty destination/free port. `implementation.patch` contains the local
implementation and notes, excluding setup and raw QA receipts. Source changes
remain uncommitted. Next: actual browser capture/interaction/AT review and matched
baseline/candidate performance runs, then fix observed defects. No push,
publication, deployment, DNS, outreach or paid work was authorized or performed.
