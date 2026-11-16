# ADR UI 004 — a stable, restrained CARTAN surface

16 November 2026. Recorded before implementation, responding to Daniel's report
of persistent white control states, page/image flashes, oversized typography,
generic symbol icons and incorrect horizon imagery. Supersedes the reveal,
light laboratory and arbitrary landscape ceiling of UI 001/002. Existing brand,
destinations, supplied forward-only film and frozen v1 contract remain.

## Diagnosis and choice

Source inspection finds a global white focus fill with a six-pixel box shadow,
unconditional hover translation, whole-surface opacity-zero entrance animation,
component-title animation and a laboratory-only white root palette. Remove these
mechanisms, not keyboard focus. Use a small high-contrast focus outline for
keyboard users; no click-to-blur workaround. Hover is optional fine-pointer
feedback and never changes geometry, opacity, backgrounds or image rendering.
Views and component content update atomically without animation. The fixed
header has no blend-mode or backdrop-filter layer. Keep one dark canvas.

The white module drawing would itself make a large luminance jump on entering
the explorer. Use the supplied dark service-bay poster there instead, depicting
the cartridge, support and host without inventing validated geometry. Preserve
the original module still in source and the module scene in the supplied film.
No CSS blending, inversion, opacity transitions or image movement. Preload the
modest bay still to avoid late arrival on navigation; preserve original bytes.

Use small custom line SVG icons, not Unicode UI pictograms. Reduce headings and
body copy, retain 44px control targets, and use open spacing, a quiet unboxed nav,
compact type and an asymmetric research composition. No imitation of Nisayon's
glass navigation, giant headlines or presentation-style scene reveals.

The hero already uses the correct Google-derived revised 19s supplied sequence.
Remove the maximum-aspect eligibility cutoff; contain the moving frame to keep
the gripper visible across landscape windows. Portrait, mobile <768px, Save-Data
and reduced-motion remain static without a source attached. Reveal video only
when a decoded frame is available where requestVideoFrameCallback exists. Keep
forward once, explicit pause/replay, and the specified 250ms end-to-poster fade.
Do not edit the film's internal cuts or claim no luminance changes inside it.

Replace the rejected old lunar/idle-arm horizon artwork with the supplied
motion-proofs/sources/assembly.png, inspected at original resolution: arms engage
the truss in the concept composition. Label it generated concept imagery and
unvalidated geometry, not observed hardware assembly. Keep old file in source
history but omit it from the new public allowlist. No new generated assets/music.

## Alternatives, boundaries, resources and falsification

Reject suppressing all focus, force-blurring controls, animated crossfades between
routes, new frameworks, custom cursors and added WebGL. They do not solve the
reported causes and introduce extra states. No scientific contracts, research
results, setup/global configuration or sibling files change. v1 stays pinned to
2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a. New analytical studies require an adapter.

Serial local tests/build only; no dependency installation or parallel build.
The unchanged 19.48MB film remains opt-in; hero 4.04MB; new original assembly still
about 2.3MB, lazy-loaded. Bound allowlisted artifact to 29MiB. Use revalidation
for mutable presentation assets to prevent stale imagery after deployment.

Reject if an excluded device attaches video, a pending frame defeats Pause,
completion restarts itself, hover/focus alters geometry or fills controls, image
navigation starts animation, focus is lost, original bytes drift, or concept
content implies evidence. Run state-machine/contract/route tests, package checks,
source-level CSS/interaction regression audit and live HTTP/hash verification.
Browser bridge currently says browser access host unavailable. Retain exact
desktop/mobile runtime checks in a local harness; do not claim they passed until
a real browser runs them. Static checks are not screen-reader or Web Vitals QA.

## Primary sources reviewed

- [MDN hover](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:hover):
  touch hover may persist until another element is touched. Restrict hover to
  capable fine pointers and remove effects that can leave a visual residue.
- [MDN focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible):
  browser input heuristics preserve a visible keyboard indication without a
  global filled focus background.
- [W3C animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html):
  unnecessary motion may be removed; preference support does not require adding
  animation for everyone else. No whole-site conformance claim follows.
