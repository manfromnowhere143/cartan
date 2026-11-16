# ADR UI 002 — revised forward-only hero

16 November 2026. Decision recorded before edits. Supersedes the hero-loop and
opt-in-only background decisions in ADR UI 001; retains the current brand,
typography, semantic copy, navigation, eight views and pinned evidence contract.
Source: Daniel's explicit instruction plus revised-edit/deliverables/
UI-UX-SESSION-HANDOFF.txt and READ-ME.txt. Originals are read-only.

Use the supplied 19-second desktop sequence once, forward, then crossfade its
video layer to the supplied landscape poster in 250ms. No loop, seek-to-start
except explicit Replay, reverse, synthetic zoom or extra camera motion. Eligible
desktop loads after checking width, aspect, reduced motion, Save-Data, visibility
and hero view. No source is attached for mobile (<768px), reduced motion or
Save-Data. Portrait/narrow tablet also uses a poster so action is not cropped.
Mobile selects the supplied portrait poster via picture/media. Keep all copy and
controls in HTML over a stronger measured scrim, including the bright module cut.

Explicit Pause persists. Leaving the hero, hiding the document or opening the
film pauses without resetting time; re-entry requires Play (a conservative choice
allowed by the handoff). A pending play promise cannot restart hidden or explicitly
paused media. Ended is stable until Replay. Eligibility loss detaches the source
and leaves a static poster; no automatic retry after denial or completion.

The existing film destination receives the exact supplied 21.5-second full review,
loads only after opening, remains paused until native Play, and exposes its ending
disclaimer as HTML. Existing masters remain available but unreferenced by the hero.
Generated assembly, exploded-module study and bay are different concept systems,
not continuous validated mechanics. No music or scientific-result changes.

Implementation: isolated hero controller module with event/state tests; no new
framework, dependency, backend or root config. Tests cover races, paused/end/error
states and zero media requests under exclusions. Add a local browser QA harness
for exact iframe viewports and retained assertions, because the browser bridge is
unavailable. All native UI actions remain through the computer-use tool. Record
real browser limits separately from controller tests and static media inspection.

Resource budget: one local HTTP process and one serial ffmpeg process at a time;
no install/build/generation. Exact supplied full film is 19.48MB, so retaining old
media raises this candidate's total above the earlier 25MiB intake budget to about
33MB; current task explicitly requests these assets. No full-film transfer until
user opens the viewer. Hero is about 4.04MB, posters about 0.35MB total. Check
source/destination hashes before tests, HTTP paths, all cuts, muted playback,
19-second ending, 1440x900/1280x720/768x1024/390x844, keyboard focus/contrast and
failure states. No deployment exists or will be made: deployed checks remain
inapplicable; verify identical local root-relative asset URLs.

Reject if a route/CTA changes, excluded devices fetch the background video, a
user pause is lost, the sequence resets without Replay, text loses contrast, or
concept imagery is described as validated hardware. Real-device and assistive-
technology verification are separate from iframe/browser QA.

Operator visual refinement: make “The mission continues.” substantially smaller,
and give CARTAN a more restrained composition distinct from Nisayon. Retain the
existing identity and useful destinations; refine the hero's proportions, spacing
and legibility. No claim of institutional endorsement or guaranteed reception.

Primary-source review (16 November 2026):
- [W3C contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html):
  evaluate normal text at 4.5:1 and large text at 3:1, including bright footage.
- [W3C moving content](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html):
  retain an accessible Pause for automatic motion lasting beyond five seconds.
- [WebKit media policy](https://webkit.org/blog/6784/new-video-policies-for-ios/):
  muted/inline media and visibility affect browser playback; catch rejection.
- [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion):
  honor the preference in both styling and media-source eligibility.
These inform implementation choices; they are not a claim of complete WCAG
conformance or current-device performance. Browser/device verification is retained
separately in the revised QA report.
