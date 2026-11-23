# UI 008 — white workspace, deliberate contrast

23 November 2026. Daniel supplies a real desktop capture of UI 007 and requests
a white default, a minimal light/dark toggle, and no gray text. This explicitly
supersedes the earlier dark-only palette and retained CSS-byte preservation.
The hero framing, source assets, film behavior and scientific contract stay fixed.

## Decision before implementation

Use pure white with near-black text by default. An explicit saved dark choice
uses near-black with white text. Interpret “white text everywhere” as white text
on dark surfaces; white-on-white would defeat the requested legibility. Remove
the muted text palette entirely. Hierarchy comes from size, weight, spacing,
position and selected indicators, not lower text contrast. Color in illustrative
geometry remains distinct from typography.

Preserve the opening film and long-horizon image as dark cinematic surfaces in
both themes; all their live labels become white. The workspace, reading surfaces,
dialog, navigation and fallback/404 surfaces follow the selected theme. No media
inversion, film re-edit or altered hero crop. The original logo asset is unchanged;
its existing inversion is scoped to dark surfaces.

A native button with switch semantics keeps the accessible label “Dark appearance”
and exposes its checked state. Touch, Space and Enter use the same click path.
No floating theme menu, animated page wipe or body recoloring transition. Keep
focus on the switch, retain selection/history/reading and do not disturb media.

A tiny hash-authorized head bootstrap resolves an explicit local preference
before styles paint; no new blocking network request. Invalid, absent or blocked
storage yields light. The setting persists across the eight paths and synchronizes
across tabs. It does not overwrite OS accessibility preferences; forced colors
retain system colors and the SVG path. No-JS is a complete light view with the
inactive theme control hidden. No OS-dark automatic default: Daniel chose light.

Make selection visible on the actual object: pale selected surfaces on dark,
graphite selected surfaces on white, matched SVG/GPU lighting palettes. The
geometry and fixture remain identical. Replace the cryptic selected-part caption
with a readable part name and short explanation. Camera and reading remain stable.
No new latches, connector pins, physical states, units or operational controls.

## Primary sources and alternatives

- [CSS Color Adjustment 1](https://www.w3.org/TR/css-color-adjust-1/) defines
  native color-scheme handling and user forced-color overrides. Use explicit
  semantic colors plus color-scheme; keep forced-color adjustment enabled.
- [WAI switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) specifies
  a stable label and exposed state. Use native button keyboard behavior.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) supplies contrast, reflow, keyboard,
  focus and target-size checks; source arithmetic is not conformance acceptance.
- [Chrome scoped transitions](https://developer.chrome.com/docs/css-ui/view-transitions/element-scoped-view-transitions/)
  documents Chrome 147+; [WebKit Safari 18](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/)
  documents its own rendering features. These do not establish actual installed
  support. A theme transition does not improve this task, so no snapshot API,
  WebGPU migration, framework or post-processing is added.

This is a use-case review, not an exhaustive survey or “most advanced” verdict.
Reiyah/Sentinel/Nisayon source findings remain in UI 006/007; no new live reference
capture is claimed. The user screenshot makes the weak selection contrast and
unhelpful caption observable. Geometry credibility still requires engineering
inputs, not more decorative detail.

## Bounds and rejection criteria

No dependency/install, paid work, Engine changes, new model session or deployment.
Retain the 484-triangle mesh and <50 kB scene-code bound. Theme code and CSS target
<8 kB combined; no loop or new media. Serial tests/builds on the M1 Pro.

Reject if saved dark flashes through a different first-paint state by design,
theme change navigates or loses focus, storage errors break content, CSS leaves
muted text, selection becomes unreadable, a hidden scene revives, or CSP requires
unsafe-inline. Run state/DOM/contrast/static-package checks, preserve all negative
controls, and record exact missing visual checks.

The native/browser bridge was retried once following the user's screenshot; it
still returns no usable surfaces and the same host/native-pipe failures. The
user-supplied frame is real evidence of one prior view. It is not a fresh local
browser, phone, GPU, VoiceOver or performance acceptance run.
