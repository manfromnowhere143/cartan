# ADR UI 005 — pointer focus and responsive motion

16 November 2026. Recorded before implementation. Daniel's new request supersedes
the earlier mobile-still and play-once requirements: mobile hero should play and
desktop should repeat. His supplied iPhone screenshot shows the remaining outline
around the film Close button after opening by touch. UI 004 removed the white
focus fill but did not resolve pointer-induced programmatic focus presentation.

## Evidence and decisions

Read-only comparison: Nisayon `808e75024395ccca9b3faf536ef1bb3b419af71a`,
`apps/instrument/src/ui/focusPresentation.ts`, `styles/focus.css`,
`research/heroMotion.ts`, `research/Opening.tsx` and focus tests. It tracks actual
pointer input, marks subsequent focus destinations, clears markers on keyboard
or assistive activation, and uses muted inline native looping with a smaller
mobile rendition. No sibling bootstrap, edits or copied scientific content.

Adapt the input-modality mechanism to CARTAN's single document. Capture pointer
before native focus/dialog handlers, suppress the outline only on controls marked
by pointer input, and carry that modality through programmatic dialog focus and
restoration. Keyboard and zero-count assistive activation clear markers. Keep
DOM focus, tab order and native media/text-entry behavior. No forced blur, blanket
outline removal or timeout that hides the symptom. Forced-color focus remains
visible. Remove decorative hover underlines too: no pointer interaction should
leave an apparent border. Evidence comes from the actual screenshot and source;
new live-browser reproduction is still blocked by the browser host connection.

Allow muted inline hero playback on phones and portrait tablets. Use native
forward loop, one decoder, no reverse or synthetic video edits. The supplied
19s desktop asset stays byte-identical. Produce one delivery-only 960×540 H.264
rendition from it, same complete sequence, timing and no audio. Originals stay
read-only. Select the smaller source for narrow windows or 3G before attachment;
do not switch sources mid-play during a resize. Retain poster on loading/denial.

Mobile uses a full-width 16:9 cinema area above the copy, rather than cropping
away working grippers to fill a portrait screen. Both movie and supplied landscape
poster share this geometry. Keep text below that area and stable before media
loads. Desktop composition remains. Static reduced-motion, Save-Data and 2G
paths attach no background source. Browser autoplay refusal exposes Play; do not
retry on unrelated touches or falsely promise autoplay in every webview.

Separate explicit user pause from visibility/route/dialog suspension. Automatic
playback resumes on return only if the user had not paused; preserve time during
suspension. Native loop maintains the existing video layer through the boundary;
do not fade to the poster and back at each cycle. The user can pause at any time.
The optional full film remains independent, paused on open with native controls.

## Boundaries and acceptance

No framework/runtime dependency, new generation, music, external messages, global
settings, research edits or new sessions. UI v1 fixture and concept labels remain.
One serial local two-thread ffmpeg encode, bounded to the supplied 19s sequence;
mobile target <2MiB, release <31MiB including the opt-in full film. Existing local
jsdom may be used for isolated DOM tests only; never claim it is mobile Safari.

Reject if pointer-opened/closed dialogs retain a marked-control outline, keyboard
or assistive focus disappears, focus is blurred, a static preference fetches
video, manual Pause is lost, native looping unloads/repaints the poster, mobile
framing crops the video, or playback failure hides the page. Test input sequences,
media races/loop/suspension, exact media properties, package and deployed bytes.
Keep browser/device/pixel checks explicitly pending while control is unavailable.

Primary sources checked 16 November 2026:
- [WebKit inline muted playback](https://webkit.org/blog/6784/new-video-policies-for-ios/):
  source for muted/playsinline behavior and gesture-bound Play fallback, not a
  guarantee about every current browser/webview or low-power mode.
- [MDN focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible):
  the browser decides visible-focus heuristics; preserve keyboard usability while
  correcting presentation after verified pointer input.
- [MDN media loop](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop):
  native repeated playback avoids an application-level video/poster transition.
