# Pointer focus and responsive looping hero — 16 November 2026

Baseline: `a75f1d62101ebb4498cd1ae48196b3aac536441f`. Owner: UI.
Decision before code: `../docs/ADR-UI-005-pointer-focus-and-responsive-motion.md`.
Daniel supplied an iPhone screenshot showing the Close focus outline after touch.
The previous change removed the fill; it did not solve input-modality inheritance.
He also explicitly replaced earlier static-mobile/single-play requirements with
mobile playback and repeated desktop playback, then authorized production release.

## Implemented behavior

A single document-level focus presenter captures pointer input before dialog
autofocus. Pointer-opened controls, headings and restored triggers are marked;
only those controls suppress their outline, without blur or changing tab order.
Keyboard input, including Safari Option+Tab, restores the visible indicator.
Zero-count assistive activation clears pointer markers. A completed pointer
gesture is paired with its click target and consumed, covering touch webviews
that emit zero-count MouseEvents without confusing the next assistive activation.
Cancellation/context menus clear the pending gesture. Forced-color mode retains
visible focus. Native film controls and text fields are not restyled by this policy.
Removed decorative hover underlines. The policy covers the whole site, including
the film Close button; no component-specific blur or delayed cleanup is used.

Read-only Nisayon comparison used commit `808e75024395ccca9b3faf536ef1bb3b419af71a`
and its focus presentation, opening and hero-motion code. CARTAN's style remains
independent. No sibling changes, dependency install or global configuration edits.

Native muted inline looping now applies to desktop and mobile. The 19s desktop
file is original; the 960×540 mobile rendition is 1,834,726 bytes, 54.6% smaller,
with the same 456 frames/24fps and no audio. Fast-start MP4; complete decode passes.
No crop, reverse, interpolation or sequence edits. One decoder keeps its painted
layer at loop boundaries rather than flashing a poster. Mobile displays the full
16:9 frame above the copy. Reduced motion, Save-Data and 2G remain static; autoplay
denial keeps a poster and explicit Play. Manual Pause is distinct from temporary
visibility, route and dialog suspension. Only temporary suspension auto-resumes.
Intersection observation follows the cinema area, avoiding a tall mobile text
layout accidentally suppressing playback. Full-film viewer remains paused on open.

## Verification and limits

- 33 core Node tests pass: adapters, pinned evidence, route semantics, CSS policy,
  source selection, native loop configuration/end fallback, first-frame races,
  manual pause, temporary suspension/resumption, queued native pause and disposal.
- 10 isolated jsdom/VM application tests pass, loading the actual application
  modules and handlers. They cover touch open/close, zero-count touch, subsequent
  assistive activation, cancelled gestures, keyboard/Option+Tab, component/evidence
  controls, native-control exclusions, mobile selection, pause and static policies.
  jsdom does not implement native video decoding or dialog autofocus: the harness
  models those steps explicitly. These are DOM integration tests, not Safari QA.
- All 11 retained original assets remain byte-identical. The one mobile derivative
  has its own provenance/hash; original film and artwork are untouched. Media
  contact sheet was inspected. The scientific fixture remains frozen synthetic v1.
- Browser inventory still returns `browser access host is unavailable`. No fresh
  real-device screenshot, actual native loop timing, pointer/touch rendering,
  screen-reader/forced-color acceptance, pixel contrast or Web Vitals result is
  claimed. The updated local matrix can check actual computed focus styles when
  browser control returns. The supplied film keeps its editorial scene cuts.

The 29-file, 29,040,131-byte package passes 328 assertions. QA, dependency paths,
private notes and historical unused imagery are excluded from deployment.

## Production verification

**Live:** https://cartan.danielwahnich.dev/. Candidate:
https://cartan-rh1a4gali-daniels-projects-ca65133a.vercel.app/.

148 authenticated candidate HTTP checks passed before exact alias assignment.
At 2026-11-16T14:02:31.327933+00:00, all **227 unauthenticated public HTTP
checks passed**: normal TLS, eight real paths, exact released-file hashes, module
MIME, CSP/security headers, canonical redirects, cache revalidation, genuine
private/QA/old-asset 404s, and actual 206 byte ranges matching both original films
and the new mobile delivery file. All receipts and the rollback deployment URL
are retained in `focus-motion-2026-11-16/`. No production QA fixture was shipped.

The runtime has no new dependencies. The optional isolated-DOM tests used existing
jsdom 26.1.0 through a local path only; it is not in the package. All source edits
are in the UI lane. Research/setup/global configuration and the original media
files were preserved. This corrects the identified implementation causes; fresh
real-device acceptance is still pending, and no universal bug-free rendering,
Web Vitals score, or superiority over a named engineering team is claimed.
