# Revised hero acceptance review — 16 November 2026

Implemented in the existing buildless CARTAN frontend, based on the supplied
`revised-edit/deliverables/UI-UX-SESSION-HANDOFF.txt`. Supersedes the previous hero
loop/opt-in policy, not the prior scientific audit or engineering contract.

The title is now 57.6px at 1440×900, 50px at 1280×720, 42px at 768×1024 and
40px at 390×844. A narrower copy measure, quieter hierarchy and more open imagery
make this a restrained CARTAN composition. Original logo, type family, brand,
links and eight-view router remain. No extra framework, decorative borders,
HUD, parallax, image zoom, soundtrack or deployment was added.

The exact supplied desktop sequence plays forward once, muted, then fades to the
supplied poster in 250ms. Explicit Replay is the only playback reset. Pause,
leaving the hero, and hiding the document preserve the timeline. The full silent
film opens paused in the existing native dialog. The ending disclaimer is also
HTML: “AI-generated design concepts. Not engineering validation.”

## Checks actually run

- Node: **16/16** adapter, pinned-contract and media-controller tests pass. Tests
  cover missing/inconclusive evidence, distinct absent/zero states, tampered
  fixture rejection, preference exclusions, autoplay refusal, pending-play races,
  user pause, visibility, errors and end/replay. Module syntax checks pass.
- Safari, local HTTP, exact-size iframes: **1440×900, 1280×720, 768×1024,
  390×844** have no horizontal overflow and all recorded hero text/navigation/
  controls fit. Portrait phone selects the 720×1280 mobile poster; portrait tablet
  uses a still. The final phone snapshot attaches no hero video source.
- Browser route/dialog assertions: **11/11 desktop**, **9/9 mobile**. Research,
  Laboratory, Evidence and Vision destinations work, route headings receive
  focus, film opens paused, Close restores focus and removes the film source.
  Desktop Pause survives leaving and returning to the hero without a reset.
- Actual desktop playback: sampled forward progress to **19.000 seconds**,
  `ended=true`, stable `phase=ended`, video opacity **0**, transition **0.25s**,
  `loop=false`, `muted=true`. No backward time sample. Explicit Replay restarted;
  native Space paused, Return resumed, and Space paused again. Visible focus was
  inspected on the motion control. Native full-film controls reached its ending.
- Reduced motion and Save-Data: explicitly injected **QA preference fixtures**
  remained static with no source attached, including during visible-browser runs.
  Mobile/portrait checks use real iframe CSS dimensions, not a UA mock. OS settings
  and a physical phone were not changed or tested.
- Autoplay-refusal and missing-video fixtures reached the poster/blocked state
  during the visible-browser run. No automatic retry. The missing-video fixture's
  intentional 404 is expected. Known denied autoplay policy can avoid source
  attachment; where a browser lacks that query, a metadata request can occur
  before play rejection and subsequent source removal.
- Four asset URLs returned local **200**, video ranges **206**, and downloaded
  bytes matched source and candidate SHA-256. ffprobe confirms H.264, 24fps,
  19s/21.5s and **no audio streams**. These are local URL checks; no deployed
  endpoint exists. Normal cases recorded no JavaScript error/unhandled rejection.
- Inspected source frames across every cut and the 1440×900 cover crop, retained
  in `hero-1440x900-cut-review.jpg`. Main gripper/joint remains visible in tested
  landscape framing. Narrow/portrait or extreme-wide ratios use a still instead.
  The white module cut is intentional; no additional flashes or transitions were
  introduced. This is not a formal photosensitivity analysis.
- Conservative contrast calculation uses white behind the entire image, recorded
  text rectangles, CSS scrims and navigation opacity. Minimum bounds among recorded
  text/control rectangles: **6.80, 5.93, 8.02 and 6.12:1**, respectively. The
  tablet scrim was strengthened after its initial bound failed. See
  `check_hero_contrast.py` and `revised-hero-contrast.json`. This supplements visual
  inspection; it is not a complete WCAG conformance audit.
- Desktop poster, paused footage/focus and final phone screenshots were inspected
  through the native computer-use tool in this session. They are in the session
  record, not exported screenshot files. The retained JPEG is a source-frame
  contact sheet, **not** a browser screenshot.

## Findings corrected during review

A hidden hero reports zero layout dimensions; treating that as narrow framing
unloaded the paused source on navigation. The app now retains its last measured
aspect while hidden. The browser regression check subsequently passed.

The first QA recorder retained references to live request arrays. Resizing the
next case later appended requests to an earlier phone result. Request-context
instrumentation identified those requests as occurring at 1440px, not 390px.
The recorder now stores independent snapshots (`snapshotVersion: 2`). Earlier
rows without that marker are historical diagnostics; prefer the version-2 static
results and the separately retained real-playback record. A paused/background
Safari prevented some autoplay checks initially; actual visible playback was
subsequently observed. The final hidden run only verifies static/layout behavior,
not autoplay refusal or missing-media playback. Those were observed in the prior
visible run and covered independently by controller tests.

## Performance scope and remaining checks

Hero transfer is **4,039,148 bytes**. Landscape and phone posters are **218,870**
and **137,698 bytes**. The optional full film is **19,481,715 bytes** and is not
requested until its viewer opens. Total retained frontend is about **33MB**,
including original historical assets, the new film and QA artifacts. Source
files are preserved exactly. There is no new runtime dependency or build step.
Intrinsic media dimensions and fixed overlay positions avoid a media-driven
layout change in the inspected views. An unsupported Safari layout-shift observer
may report zero; its value is **not** proof of zero CLS.

Physical iOS/Android touch checks, VoiceOver/screen-reader traversal, actual OS
reduced-motion/Save-Data settings, native tab-hide/offscreen playback checks,
slow-network LCP/INP, CPU/battery profiling and cross-browser verification remain
open. Native Space/Return and route/dialog focus checks are narrower evidence.
No performance certification or complete accessibility conformance is claimed.

Engineering v1 stays pinned at `2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a`.
The UI still consumes a labelled synthetic fixture, with unmeasured outcomes.
Generated assembly, module study and service bay depict different proposed systems.
No CAD, verified dimensions/kinematics, physical test, flight hardware, validated
recovery or measured advantage was introduced. Older media remains byte-preserved
and unreferenced by the revised hero. Daniel retains soundtrack and publication
control.

Review artifacts: `revised-hero-browser-results.json`, `revised-hero-playback.json`,
`revised-asset-verification.json`, `revised-hero-contrast.json`. Re-run locally with
`python3 frontend/qa/preview_server.py 4178`, then open `/qa/hero-review.html`.
The QA server binds loopback only; QA preference injection is absent from the
production document. Stop the owned server after review.
