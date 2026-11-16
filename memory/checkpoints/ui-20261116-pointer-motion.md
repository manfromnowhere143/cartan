# UI checkpoint — pointer focus and responsive motion

16 November 2026. Owner: UI; baseline `a75f1d6`; lane `ui/visual-laboratory`.
Daniel supplied an actual iPhone screenshot of the persistent Close outline,
requested the Nisayon behavior, mobile hero playback and repeated desktop
playback, and explicitly authorized production deployment. These supersede the
earlier supplied film brief's static-mobile and one-play requirements.

Read `frontend/docs/ADR-UI-005-pointer-focus-and-responsive-motion.md` and
`frontend/qa/REVIEW-FOCUS-MOTION-2026-11-16.md`. The focus presenter now pairs real
pointer gestures with their focus destinations and suppresses only their outline.
Keyboard/assistive presentation remains; native focus is never blurred. The
touch screenshot's Close case is covered alongside restored triggers and other
controls. Nisayon was read-only inspected at `808e750`; no sibling bootstrap/edit.

Hero now uses native forward looping, muted inline playback and a 1.83MB 540p
delivery rendition on small screens/3G. Full 19s sequence; no reversed motion,
crop, new scenes, audio or altered originals. Mobile gets a full-frame cinema
area above copy. Reduced motion/Save-Data/2G and denial preserve posters. Manual
Pause survives navigation; only temporary view/dialog/visibility suspension
resumes automatically. Backend/fixture/scientific claims remain unchanged.

33 core tests, 10 isolated DOM integration tests and 328 package checks pass.
All originals match; new delivery file is separately hashed and fully decoded.
DOM tests run actual application modules with explicitly modeled media/dialog
behavior; they are not mobile Safari or pixel/performance acceptance. Browser
inventory still reports host unavailable. Retain that limit after publication.

Production is live at https://cartan.danielwahnich.dev/: 148 authenticated
candidate checks and 227 unauthenticated canonical HTTP/TLS checks passed at
2026-11-16T14:02:31.327933+00:00. Exact alias points to
https://cartan-rh1a4gali-daniels-projects-ca65133a.vercel.app/.
See `frontend/qa/focus-motion-2026-11-16/` for receipts and rollback URL. Research has published its own branch to the
verified CARTAN GitHub `origin`; UI does not overwrite `main` or research work.
The integration owner can consume this UI checkpoint's commit separately.
Setup ownership, original source assets, and frozen v1 remain preserved.
