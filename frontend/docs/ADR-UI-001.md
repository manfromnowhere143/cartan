# CARTAN visual laboratory: first local slice

## Operator design correction, 16 November 2026

Daniel reviewed the first preview and explicitly rejected the bordered, stacked
presentation structure. The successor is one dynamic screen with addressable
views and contextual inspections. Remove decorative rules, bordered cards,
dividers and the visible schematic lines. Retain meaningful content through
research, component, evidence, comparison and source views. Change views on
deliberate selection, preserve browser Back/Escape and focus, and avoid an animated
camera or mandatory intro. Component artwork remains illustrative and cannot
become a physical mechanism. Reduced motion uses immediate changes. This
supersedes the initial long-scroll layout below; the audit remains historical.

Engineering v1 subsequently arrived at immutable commit
`2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a`. It was imported into the frontend's own
vendor boundary, hash-verified and validated with 16 rejected negative controls.
The runtime checks the pinned fixture digest before rendering it. The earlier
frontend-local fixture is retained for its negative tests, not loaded as evidence.

## Final interaction decision

The implementation uses semantic hash links and one visible/inert-managed view.
The page commits the new state immediately, then optionally reveals it with a
340ms opacity/12px translation. Native [Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)
returns a cancellable animation; [document.hasFocus](https://developer.mozilla.org/en-US/docs/Web/API/Document/hasFocus)
and visibility constrain this nonessential effect. Reduced motion is immediate.
A snapshot-based View Transition candidate was removed: it added another visual
lifecycle without improving this small interface's task. Native QA screenshots
sometimes lagged the accessibility state, so no browser-engine defect is inferred.
This bounded reveal has no dependency, camera movement or synthetic mechanism.

No decorative lines remain. High-contrast focus feedback and forced-colors focus
outlines remain functional accessibility cues. Content views can scroll when the
reader needs room, without forcing a journey through other sections. No-JS or
failed-router content remains an ordinary readable document. The hero, component
study and long-term view preserve the supplied imagery and its concept labels.
`qa/REVIEW-2026-11-16.md` distinguishes executed checks from pending device checks.

## Historical intake audit and initial decision

The following records the initial design before Daniel's correction and the v1
handoff; the two current decisions above supersede conflicting implementation
details, pending-contract statements and references to a visible schematic.

16 November 2026. UI decision, recorded before implementation. Local preview only.

Daniel's latest request assigns the visual experience while a separate engineering
task owns research, backend and authoritative contracts. This conversation began
in the research lane. No research file is edited. The UI candidate is prepared in
an isolated temporary directory pending installation in the verified clean UI
lane. Setup configuration remains untouched. No other model session is launched.

## Inspected state and conflicts

The complete November 16 reading list, both assigned prompts, v3, historical v2,
source ledger/audit and visual mission were read. All seven deck pages and four
appendix pages were rendered and inspected. The launcher preflight verifies all
12 input hashes; it first failed inside the sandbox, then passed through approved
escalation without starting a model. Research's four new uncommitted documents
belong to the engineering task and are not a frozen contract or live evidence.

The standalone logo matches its existing provenance manifest. Film delivery now
exists: four clean 8-second clips, posters, a 16-second forward/reverse hero loop
and silent 48-second review films. Seven delivered video hashes match the producer
manifest. The producer explicitly leaves human playback/final pacing open. The
preproduction source manifest predates delivery and must not override the newer
delivery notes. Rights are source-reported; independent clearance is not asserted.

The appendix's baseline-failure criterion is superseded by v3: useful reduction
in intervention, recovery time or cost can matter at accepted safety. The visual
mission's short attach/isolate/remove order is illustrative, not a physical guard.
No editable CAD/glTF, reviewed physical geometry, measured thresholds or frozen
engineering v1 is available to this UI at intake. No new generation is needed.

## Chosen experience and alternatives

1. An immediate HTML introduction and original poster, black/white identity,
   normal scrolling, readable concept label and optional silent motion.
2. A component study separates the producer's conceptual artwork from an
   inspectable functional schematic. DOM controls and descriptions remain usable
   without images or JavaScript. Show unknown dimensions and measurements as words.
3. An interruption example explains command, report, actual state and belief
   separately. It is a frontend-local synthetic fixture, not an experiment.
4. An evidence view defaults to planned work and preserves unavailable,
   inconclusive, failed and unsafe outcomes when genuine records become available.
5. Prior art and proposed B0/B1/B2/C comparisons remain visible, followed by the
   larger orbital vision as concept imagery. The film opens only on request.

Use buildless semantic HTML, CSS and native JavaScript modules. No root manifest,
framework, service, CDN, telemetry or GPU dependency. Prefer a functional SVG
schematic over invented 3D. Revisit Three.js or model-viewer once an approved model
and an actual spatial task justify them. Do not ship two rendering engines.
Native video suits the short supplied MP4; streaming infrastructure is unnecessary.
The 48-second film is never the initial background download. No soundtrack is
chosen, added, synthesized or borrowed; Daniel retains that decision.

Hero motion is opt-in for this first slice, an intentional improvement over the
producer's autoplay suggestion: a stable first reading, no initial video transfer
and fewer motion/decoder dependencies. Reduced motion keeps the hero static.
Pause on hidden/offscreen and after film dismissal; no unexpected restart.
Nisayon's inspected Opening.tsx, heroMotion.ts and opening.css establish useful
poster-first separation, native video, focus and visibility patterns. Its assets,
scientific claims, account integrations and soundtrack are not copied.

## Interfaces and evidence boundary

`data/fixture.json` uses `cartan-ui-fixture/0.1`, explicitly local and synthetic.
`adapter.mjs` rejects unknown versions, retains tagged missing/unknown/unmeasured/
null states and real zero/false values. It cannot promote a fixture to simulation
or physical evidence. No canonical Component/Claim/Scenario/Run/Asset contract is
invented here. Engineering handoff needs a source commit, SHA-256 manifest,
validator and schema version. Pin and adapt that artifact only after receipt.

Static asset metadata includes source path, hash, producer, review and scientific
status. UI delivery copies preserve bytes. Source masters remain unchanged.
Poster, motion, film and geometry can each be unavailable independently. An asset
failure cannot hide navigation, the research question or the text explanation.

## Budget and verification

One local preview process, no parallel builds/installations. Under 25 MiB retained
site files, no network jobs except public research reads and local preview. Initial
transfer target <=1.5 MB excluding optional media; video loads only on explicit
intent. No 3D means no claim about 60/30 fps rendering. Measure actual browser
behavior; distinguish desktop resizing from real iPhone testing. Inspect 320 px,
phone and desktop widths, keyboard navigation, zoom/reflow, focus restoration,
reduced motion, failed images/video/data, hidden/offscreen playback and repeated
film entry/exit. Record what actually ran. No automated score alone establishes
accessibility or field Core Web Vitals.

Reject this design if users cannot identify the question and evidence status
without motion, if artwork suggests a validated mechanism, if the small-screen
layout hides controls, or if missing media blocks the page. Revisit the renderer
only when a geometric task cannot be communicated with the current schematic.
Publication, physical tests and product-readiness claims remain outside this work.

## Primary-source design review

Retrieved 16 November 2026. These sources inform design; they do not certify it.

- [W3C Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html):
  automatic motion alongside content needs control; persistent pause is selected.
- [W3C Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html):
  avoid nonessential camera/parallax effects and honor reduced motion (AAA criterion).
- [W3C Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html):
  24 CSS px minimum with exceptions; this UI targets 44 px controls.
- [Three.js WebGPURenderer](https://threejs.org/manual/pages/webgpurenderer):
  supports WebGPU/WebGL2 fallback, with material/postprocessing differences.
  It does not prove a speedup on this device. An older /manual/en URL returned 404.
- [model-viewer loading](https://modelviewer.dev/examples/loading/): posters and
  deferred models are useful; compression decoders have costs. No model is available.
- [MDN Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API):
  pause unnecessary playback on visibility changes; also observe offscreen status.
- [Web Vitals](https://web.dev/articles/vitals): LCP, INP and CLS have distinct
  meanings. Local observations are not field percentile measurements.

Science presentation was checked against JPL's Orbital Express page, SPACE USB
sections 3–5, the PASS NTRS abstract and GAO-25-107555 web summary. Detailed methods
and model comparisons remain engineering's work. The UI asserts no novel mechanism.
