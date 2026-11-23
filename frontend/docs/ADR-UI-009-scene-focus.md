# UI 009 — one focus policy for the whole workspace

23 November 2026. Daniel's 12:45 desktop capture shows a persistent rectangular
outline around the interactive scene after pointer input. The prior UI 005
pointer policy covered native controls and reading tables but omitted the new
UI 007 focusable viewport. Its independent `:focus-visible` rule could therefore
remain eligible after a click. This is an integration defect, not scene geometry.

## Decision before implementation

Keep one document-level input policy. Give custom, non-editing focus surfaces an
explicit `data-focus-surface` contract, handled alongside existing native controls.
Register the scene and retain its actual focus, tab order and arrow-key behavior.
Do not blur it, cancel pointer default focus, remove its tabindex, or suppress
outlines globally. The existing single suppression rule applies only to a
pointer-marked focused element and remains disabled in forced colors.

Keep visible keyboard indication, including when a non-modifier key follows a
pointer click without a focus move. Assistive-style zero-count activation clears
pointer presentation. Native text inputs and media controls stay outside this
policy. Audit all current custom tab stops; future custom surfaces must opt into
this shared contract and its regression tests.

Unexpected pointer-capture loss must cancel an unfinished camera drag and restore
the committed URL camera. Normal pointer-up remains a single commit. Losing the
window clears pending gesture provenance; it does not blur or navigate content.

Alternatives rejected: blanket `outline:none`, per-widget blur, timing-based
outline removal, and disabling keyboard scene access. No dependency, animation,
geometry change, new assets or scientific contract change is justified.

## Sources and acceptance

- [Selectors 4 focus-visible](https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo):
  browser heuristics distinguish focus indication from focus itself.
- [Pointer Events 3 capture loss](https://www.w3.org/TR/pointerevents3/#the-lostpointercapture-event):
  capture termination is an explicit lifecycle event.
- [WCAG focus visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html):
  keyboard focus needs a persistent visible indicator.

First reproduce the omitted viewport in a DOM regression. Then test nested SVG
and canvas input, keyboard after pointer, assistive activation, cancelled/lost
capture, ordinary controls, focus return and theme changes. Retain forced-color
CSS and all native media behavior. Reject if a pointer scene remains unmarked,
keyboard use remains suppressed, cancellation commits a camera, or media/input
focus is intercepted. DOM tests cannot establish actual browser pixels or AT.

The browser bridge is still unavailable as recorded in UI 008. Preserve that
limitation and the supplied capture as a before observation; do not invent an
after capture. Replace the owned preview on port 4182 with the combined candidate
so Daniel's existing URL receives this fix and the white-default appearance.
