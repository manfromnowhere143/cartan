# UI checkpoint — revised cinematic hero — 2026-11-16

Owner: UI work, operator-directed continuation from the research-rooted session.
Target: approved same-repository UI lane, `ui/visual-laboratory`.
Base: `8c34d1ce842d7edebf9dd8546db85a43f3c122b0`.
This checkpoint accompanies the revised-hero commit; no remote/publication.

Scope: existing hero refinement and exact revised-film integration. ADR UI 002
precedes implementation. Smaller headline and quiet composition distinguish
CARTAN while preserving its logo, typography, navigation and destinations.
19s forward-only desktop autoplay ends on the supplied poster; Pause persists,
Replay is explicit. Phone, reduced-motion, Save-Data and narrow framing use stills.
21.5s optional silent film opens paused and exposes its disclaimer as HTML.
Original source assets and earlier local media remain unchanged. No soundtrack.

Changed boundary: frontend HTML/CSS/app, isolated media controller/tests, asset
registry and four supplied files, README/ADR and local QA evidence. No backend,
root manifests, launchers, MCP/shell settings or shared scientific contract edits.
Canonical v1 remains pinned to `2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a`;
fixture SHA-256 `b231fa24f057ce647dbf282ed8233fc88d0bbbed579995213306edac30e65d44`.
No new evidence API/schema. Integration owner can review this UI commit independently.

Validation: 16 Node tests; syntax checks; four exact Safari iframe sizes; desktop
11/11 and mobile 9/9 route/dialog assertions; actual forward playback to 19s and
poster opacity 0; Replay/Space/Return/Pause; preference/failure fixtures; source
hash/HTTP/range/no-audio checks; source-cut/crop inspection; contrast bounds.
Full details and caveats: `frontend/qa/REVIEW-REVISED-HERO-2026-11-16.md`.
Browser QA found and fixed a hidden-layout/paused-position bug. QA request arrays
now snapshot independently; prefer snapshotVersion 2 and the separate playback
record. Physical touch, actual OS preferences, screen-reader, native background
switching, cross-browser and throttled performance checks remain open.

Next: Daniel's visual review and remaining real-device acceptance. All imagery
remains generated concept, fixtures synthetic, scientific outcomes unmeasured.
No validated hardware, flight capability or mechanical continuity implied.
