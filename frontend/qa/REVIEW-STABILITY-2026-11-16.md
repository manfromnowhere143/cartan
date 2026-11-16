# CARTAN stability and visual refinement — 16 November 2026

Source baseline: UI `0afc064f145641d472f063fc4c66d07dd584ba80`.
Decision before implementation: `../docs/ADR-UI-004-stable-surface.md`.
Scope: Daniel explicitly requested fundamental fixes to flashing, filled/stuck
control states (including the film Close button), imagery and visual restraint.
Existing public hosting authorization remains in force. No setup/global or
engineering worktree edits, new sessions, soundtrack or generated images.

## Changes

- Removed the shared white focus background and six-pixel shadow. Kept a small
  visible keyboard outline and native dialog focus restoration. No force-blur.
- Removed route-wide opacity/translation reveals and component-title animation.
  Laboratory now shares the same dark canvas as every other research view.
  Header/image blend modes and backdrop filters are removed. Hover only applies
  to fine pointers; it cannot move, fill, fade or transform a control/image.
- Replaced symbol-font UI pictograms with 16px custom line SVGs. Reduced the
  opening headline to 32–44px and horizon to 34–48px, plus quieter research type.
  Retained control hit areas, semantic content, original logo and eight paths.
- Removed the glass navigation capsule. Open spacing and compact typography give
  CARTAN a quieter identity. This is an editorial refinement, not a claim of
  novelty or guaranteed reception by a particular design/engineering team.
- Explorer uses the supplied dark service-bay still instead of the white module
  poster. It is preloaded, stable and never animated. Horizon uses the supplied
  assembly image with arms engaged on the truss. Original files are preserved;
  the old module/horizon stills are excluded from the public allowlist.
- Correct supplied 19s hero remains byte-identical. Landscape frames are contained
  rather than cropped; removed the aspect-ratio ceiling that suppressed desktop
  playback. Video is revealed after a decoded frame where the API exists.
  Mobile, portrait, reduced-motion and Save-Data stay static; one forward play,
  explicit Pause/Replay and specified 250ms final poster transition remain.
- Film Close and every other button share the corrected focus styling. The
  21.5s film remains paused on opening. No added audio, reverse or forced loop.
- Removed two broken public links to unpublished engineering Markdown. The exact
  pinned fixture remains available; no private research publication was added.
  Mutable public assets revalidate to avoid serving stale presentation imagery.

## Checks actually run

- 27 Node tests pass: immutable contract/adapters, route mapping, source-level
  presentation invariants and playback state machine. New cases include compact
  and ultrawide landscape eligibility, first-frame reveal, and late frame callbacks
  after Pause, route exit or reduced motion. JavaScript syntax checks pass.
- Canonical fixture validator passes, including 16 rejected negative controls.
- 325 static package assertions pass. Package: 27 files, 27,200,618 bytes, including
  the opt-in 19,481,715-byte film; no runtime dependency, analytics or font request.
- All 11 registered original assets match source bytes and their recorded hashes,
  including preserved unused files and the new assembly image. Frame dimensions
  and originals remain intact. These are asset-integrity checks, not physical QA.
- Local browser matrix prepared for 1440×900, 1280×720, 768×1024, 390×844,
  320×740 and 3440×1440; reduced motion, Save-Data, denied and failed media; routes,
  explorer image geometry, focus/dialog behavior, errors and layout shifts.
  **Not executed:** browser inventory again returned `browser access host is
  unavailable`. No new desktop/mobile screenshots, actual pointer/keyboard/touch
  acceptance, pixel contrast result, screen-reader test or Core Web Vitals score.
  Earlier Safari results remain historical and do not qualify this new revision.
- Removed the mechanisms identified by source inspection; the user's exact
  browser symptom has not been independently reproduced or rechecked here.
  The supplied film retains its editorial cuts and brightness changes. No
  universal “zero flashes” or accessibility/performance certification is claimed.

## Production readback

Published to **https://cartan.danielwahnich.dev/** after 139 authenticated candidate
HTTP checks passed. Exact alias assignment succeeded. New deployment:
https://cartan-6jgayn4j2-daniels-projects-ca65133a.vercel.app/.

At 2026-11-16T13:43:54.203213+00:00, **212 unauthenticated public HTTP checks
passed**, including normal TLS, all eight pages and exact released-file hashes,
module MIME, CSP/security headers, canonical redirects, genuine private/QA/unknown
404s, removal of old horizon/module images, mutable-asset revalidation and actual
206 responses matching the first 1,024 bytes of both original films. This verifies
network delivery, not browser rendering or accessibility. See the retained JSON
receipts under `refinement-2026-11-16/`. Previous deployment is retained in its
`deployment.json` for rollback.

Google Search Console submission remains pending existing owner authorization
renewal. DNS and publication are complete. Fresh browser/device review remains
the next acceptance step; the bridge failure was not bypassed.

All imagery remains concept material, the fixture remains synthetic v1 pinned to
`2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a`, and outcomes remain unmeasured.
No unreviewed mutable engineering study was imported.
