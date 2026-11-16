# ADR UI 006 — match the hero poster to the opening frame

16 November 2026. Decision before edits. Daniel identified the service-bay still
switching to unrelated orbital assembly when the hero starts. He requests the
same opening image, or no poster only if that would not delay visible content.

Keep an immediately discoverable high-priority image rather than a blank surface
waiting for video. Extract frame zero from each actual delivery MP4 (720p desktop,
540p mobile) into an optimized WebP. No generative reconstruction, changed artwork,
video edit, music, new runtime dependency or artificial playback delay. Original
source films/posters remain untouched. Both extracts have the same scene and 16:9
geometry as their corresponding movie's opening. Use contain/center for both
layers everywhere, including desktop; the prior cover/55% poster crop would still
jump even after replacing the image.

Use mutually exclusive media-conditioned high-priority image preloads and a
matching picture source. Remove the redundant native hero poster attribute: the
dedicated image already holds first paint, static preferences and failed playback.
This also avoids a second desktop-sized poster download on mobile. Reveal the
video on its existing decoded-frame callback without a 250ms opacity dissolve;
matching still-to-motion does not need overlapping frames or a blank interval.
Video starts independently; no timer, image-decode wait or extra loading gate.
Use the matching opening concept still for the optional film cover too. Preserve
the service-bay artwork in the component explorer and its preparation behavior.

Resource budget: two serial single-frame ffmpeg exports; desktop/mobile posters
each below the old 218,870-byte landscape poster, mobile target <100KiB. Full
public package remains <31MiB. Keep explicit Pause, forward looping, mobile
framing, reduced motion, Save-Data, 2G and blocked-playback behavior unchanged.
Frozen synthetic v1, source/evidence boundaries and other worktrees are unchanged.

Verify frame extraction, dimensions, file sizes and image/video alignment rules;
run existing regressions and package/live byte checks. Browser control has been
unavailable; do not claim an observed device startup time or pixel-perfect live
handoff without a real browser. No promise about zero network latency follows
from a smaller high-priority poster. Film scene content remains concept imagery.

Primary sources reviewed:
- [web.dev video loading](https://web.dev/articles/lazy-loading-video): an LCP
  poster can be discovered early with image preload and high fetch priority.
- [MDN video poster](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video#poster):
  a poster is the pre-play image; a separate existing image layer can supply the
  same fallback while the actual video source and first frame become ready.

Operator follow-up: desktop edge strips reveal the old cover-cropped image behind
the contained video. Use identical centered containment and an opaque matte for
both layers, removing the dissolve. The homepage must fit one viewport: shorten
copy, preserve all destinations, and budget the mobile cinema against viewport
height. Keep essential controls accessible; allow reflow at extreme zoom rather
than hiding content. Daniel authorizes production and main-branch integration.
