# Local interior candidate — 23 November 2026

**Implementation and automated checks pass. Browser/phone visual acceptance is
open. Nothing was published.** Owner: UI, `ui/visual-laboratory`, baseline `dcc8d8e`.
The pre-existing launcher repair remains byte-identical and unrelated.

Candidate: http://127.0.0.1:4181/ · Baseline: http://127.0.0.1:4180/.
The servers bind loopback only. Candidate package:
`/private/tmp/cartan-interior-candidate-20261123-final`.
Baseline package: `/private/tmp/cartan-interior-baseline-20261123`.
Both are ephemeral review artifacts, not publication targets.

## What changed and what was proved

One persistent schematic now connects part selection, interface explanation,
interrupted-state inspection, evidence and return. The same object anchors
research, comparisons and sources. The longer horizon keeps its separate
concept imagery. All commits to route/selection state are instantaneous;
no reveal timer, full-screen fade, glass, blur or renderer was added.

| Check | Result and evidence |
| --- | --- |
| Core Node tests | **37 passed**, including URL round trips, legacy aliases, selection containment, fixture projections and existing media policy. `interior-2026-11-23/core-tests.tap` |
| Application DOM tests | **19 passed** serially: existing 10 focus/media tests and 9 new sequence/history/reselection/late-data/error tests. `dom-tests.tap`. jsdom is not browser layout, native touch or AT. |
| Frozen contract | **Valid; all 16 negative controls rejected.** All five vendor files unchanged. `contract-verification.json`, `preservation.json` |
| Allowlisted release | **397 assertions passed**, eight static routes, unique canonical metadata, native return links without JS, sealed files, original assets, excluded private material and true 404 config. `package-verification.json` |
| Local delivery | **25 HTTP checks passed** across baseline/candidate routes, query URL, unknown/private 404s, QA harness and exact 1,024-byte video range. `local-http.json`. Local preview does not reproduce hosting CSP/header behavior. |
| Preservation | **28 checks passed:** hero markup, media/dialog wiring, original CSS, controllers, all retained original assets, contract adapter/pin/vendor files and launcher repair. `preservation.json` |
| Declared color contrast | **5 pairs passed:** text, muted text, focus and two geometry strokes against their opaque backgrounds. `declared-color-contrast.json`. This is sRGB arithmetic, not browser pixel acceptance. |
| Syntax/diff hygiene | JS syntax, Python compile and `git diff --check` passed. No dependencies installed. |
| SVG inspection | Drawing rendered with local librsvg and visually inspected. Labels/relationships remain distinct. `schematic-review.png` is not a page screenshot. |

The new tests found and corrected the module/default-retention URL round-trip
bug. They also required adding `structuredClone` to the jsdom environment and
waiting for lazy fixture reads before destroying the DOM; the older harness
did not assert successful fixture rendering. No failed fixture was turned into
plausible candidate states to satisfy a test.

## Browser, accessibility and capture limits

The browser bridge returned `The browser access host is unavailable`. Native
Chrome initially opened the baseline preview, exposed its accessibility tree and
returned one desktop opening screenshot in the conversation. It was visually
inspected. The attempt to save captures and proceed to Laboratory failed with
`Sky Computer Use native pipe startup failed`; a second Chrome read failed too.
A later Safari entry failed with the same error. No unrelated tab was changed.
No permissions, launch settings or global browser settings were changed to work
around the failure.

Consequently these checks are **not run**, not passed:

- Baseline laboratory, interrupted state and evidence captures; all baseline
  phone captures; all candidate desktop/phone before/after captures.
- Candidate Chromium or Safari visual review at 1440×900, 1280×720, 390×844,
  320×740 or 844×390. The opening screenshot has the native window's size,
  not a verified CSS viewport size.
- Actual keyboard traversal/focus visibility and return, touch without hover,
  browser Back/Forward, rapid selection/Escape, zoom/reflow and fixed-header
  occlusion. DOM versions passed where listed above.
- Actual VoiceOver or any other screen reader; an accessibility tree is not a
  screen-reader session. Native dialog autofocus/Escape are modeled in jsdom.
- Reduced-motion, forced-color, filter-disabled, JS-disabled and media-failure
  **rendered** views. Static/data/DOM paths were checked, not browser appearance.
- Browser runtime feature probes, physical phones, field conditions, battery use,
  ten-minute device use, Web Vitals or full accessibility conformance.

The source is inspectable and reversible, but these missing checks prevent a
claim of visual completion. Do not deploy this candidate on the strength of the
automated results alone.

## Performance result and remaining measurement

Named local machine: MacBookPro18,1, Apple M1 Pro, 16 GiB, macOS 14.4 (23E214).
Running Chrome was 157.0.8103.51. Safari runtime/version could not be inspected.

Static package accounting: **29,312,533 → 29,372,996 bytes**, +60,463 bytes
(**0.206%**). Most added bytes are the inline, inspectable SVG and static reading
content repeated across eight prerendered pages, plus 8,394 bytes of interior CSS
and a small state module. The 31 MiB bound still passes. The complete accounting
is `package-comparison.json`; source size is not transferred-byte measurement.
The old interior poster preload is removed, and the fixture request is deferred
until inspection/evidence. No new image, 3D asset, font or runtime dependency is
requested for the opening. These choices reduce avoidable work but do not prove
a faster device experience.

**Not measured:** cold-entry transferred bytes, interaction latency, dropped
frames, long tasks, LCP/INP/CLS and repeated-selection timing in an actual browser.
No emulation score or Node test duration is substituted for these results.

`/qa/interior-review.html` on either server provides identical viewport choices
and local measurement/retention controls. It records ResourceTiming, native
feature detection, available long-task entries and repeated click-to-next-rAF
samples. Programmatic input is labeled, and rAF gaps are not claimed as GPU
dropped frames. It has **not been executed**. The default profile is unthrottled
local CPU/network with no-store responses. For a separate bounded run use
`--profile slow`: approximate 40ms/request and 1MiB/s/body server pacing, still
unthrottled CPU. It is not a phone-network model. Run baseline and candidate with
the same profile/viewport/browser, and retain each raw result before accepting
the candidate. Neither profile has browser performance results yet.

## Reproduction and next action

```sh
node --test --test-concurrency=1 frontend/tests/*.test.mjs
CARTAN_JSDOM_MODULE=/path/to/existing/jsdom node --experimental-vm-modules --test --test-concurrency=1 frontend/qa/focus-dom.test.mjs frontend/qa/interior-dom.test.mjs
python3 frontend/vendor/cartan/v1/validate.py frontend/vendor/cartan/v1/fixture.json --self-test --manifest
python3 frontend/release/build_site.py /private/tmp/cartan-interior-new-review
python3 frontend/release/verify_package.py /private/tmp/cartan-interior-new-review
python3 frontend/qa/interior_server.py /private/tmp/cartan-interior-new-review --port 4181
```

Use an empty build destination and a free port. Read UI 006, the route/state map
and provenance supplement before editing. Next: restore normal browser access,
capture both packages at the specified viewports, complete keyboard/touch/AT and
fallback review, then measure the same sequence under named profiles. No push,
deploy, DNS change, external message, paid job or Engine import is authorized here.
