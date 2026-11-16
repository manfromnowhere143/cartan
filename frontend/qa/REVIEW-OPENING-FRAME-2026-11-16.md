# Opening frame and viewport release — 16 November 2026

The hero now uses actual frame-zero WebP extracts from the existing 720p/540p
movies. Both image and video share centered containment and an opaque matte;
the old cover crop cannot leak into desktop side bands. High-priority responsive
preloads preserve immediate image discovery. The decoded-frame reveal has no
crossfade or artificial wait. Original films and artwork are unchanged.

Homepage copy is shorter, with viewport-height composition and a bounded mobile
cinema. All navigation destinations, keyboard focus, pointer-focus handling,
Pause, reduced motion, data-saving preferences and concept labels remain.
Normal portrait and landscape sizes use compact layouts; extreme zoom may reflow
to preserve access. No body scroll lock conceals controls.

33 core and 10 isolated DOM tests passed. These cover focus, media state and
navigation, not browser layout. Package and deployment receipts accompany the
release. The browser bridge remains unavailable, so current desktop/mobile
pixel rendering and real-device playback are not claimed as observed.

Production: https://cartan.danielwahnich.dev/ now serves the matched-frame release.
332 package, 156 candidate HTTP and 239 unauthenticated public HTTP/TLS checks
passed. Public readback at 2026-11-16T14:25:28.091701+00:00 verified exact deployed
bytes, canonical routes, HTTPS, private-file exclusion and all video byte ranges.
Receipts: `opening-frame-2026-11-16/`. GitHub main includes UI dcc8d8e via merge
2104ed2; integrated frontend tree exactly matches the tested release source.
