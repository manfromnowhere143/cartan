# Spatial instrument — state, source and provenance

23 November 2026. UI 007 succeeds UI 006's scene implementation. The earlier
route/research findings and frozen contract remain valid. Decision:
[ADR-UI-007](ADR-UI-007-spatial-instrument.md). Results:
[spatial review](../qa/REVIEW-SPATIAL-2026-11-23.md).

## One document and one state owner

`workspace-state.mjs` parses and serializes the URL. `app.mjs` commits history,
content, selection, focus, metadata and reading position together. The spatial
controller keeps only an interruptible display camera and pointer gesture. It
cannot modify a fixture or inferred physical state.

| Crawlable path | Workspace purpose and exit |
| --- | --- |
| `/` | Approved opening; Enter Laboratory. No scene module import. |
| `/laboratory/` | Select a relationship; reveal interface; inspect transfer; return to overview. |
| `/interruption/` | Verified synthetic report and two authored candidates; evidence; return to interface. The geometry does not change to imply either candidate. |
| `/evidence/` | Contract receipt, source and missing outcomes; contextual return to transfer. |
| `/research/` | Research question with the selected object retained; sources/comparison; overview. |
| `/comparison/` | B0/B1/B2 and candidate boundaries; evidence return. No performance plot is invented. |
| `/sources/` | Primary methods and source-reported work; research return. |
| `/vision/` | Existing explicitly unvalidated concept imagery; research return. Spatial drawing suspends because this is a different evidence class. |

The eight generated paths and legacy hash aliases remain. Queries are enhanced
selection; without JS each generated path has meaningful text, native navigation
and static geometry where relevant. No-JS query-specific selection is not claimed.

| URL field | Allowed values / meaning |
| --- | --- |
| `part` | module, retention, isolation, support |
| `detail` | interface, only within Laboratory |
| `record` | planned, simulation, physical_test, inconclusive; absent evidence stays absent |
| `from` | interruption, for an explicit evidence/comparison/source return |
| `camera` | overview (omitted), interface, profile; a viewing direction, not a system state |
| `az`, `el` | Bounded integer viewing angles; invalid values discarded; no physical orientation is inferred |
| `layout` | joined (omitted), separated; graphic separation, not an actuation trajectory |
| `render` | automatic (omitted), drawing; force the same-mesh SVG |
| `notes` | open (omitted), closed; return to reading through Show notes or a destination link |

Native part buttons choose a useful viewing direction. Picking visible geometry
retains the current viewing direction. Both commit the same selected part. Drag
and arrow-key orbit replace the current history entry, avoiding a trail of camera
samples; deliberate buttons and research destinations push meaningful entries.
Escape follows interface → part → Laboratory → opening, with contextual returns
from inspection/evidence. Back restores focus and reading position. Rapid input
cancels the previous camera reveal; its final coordinates are exact URL targets.

On large windows the object stays visible beside one opaque, scrolling reading
surface. Narrow/short windows return to ordinary document flow. No scroll snap,
page wipe, modal interior, blur or full-screen transition is used. Large camera
changes cut; smaller changes may ease for at most 320 ms. Reduced motion, drawing
mode, data saving and forced colors use instant changes. There is no idle RAF loop.

## Drawing and evidence boundaries

| Artifact | Provenance and limits |
| --- | --- |
| `scene-geometry.mjs` | Original `spatial-schematic/1.0.0`: 11 bevelled boxes, 484 triangles, arbitrary drawing units. Envelope, host frame, independent support and featureless electrical marker. No CAD, dimensions, material specification, circuit, latch design or validated travel. |
| `webgl-scene.mjs` | Original small WebGL2 lighting/depth pass; no engine, textures, external model or runtime package. Its light is illustrative, not a material/optics calculation. |
| Static SVG and runtime drawing | Projected from the same mesh; source checked against generated output. Scalar framing adapts to viewport; it never changes geometry. This path remains available without GPU support. |
| `spatial-2026-11-23/geometry-manifest.json` | Version and SHA-256 of geometry and review drawings; not an engineering manifest. `render-spatial.mjs --update-static` regenerates the fallback intentionally. |
| Frozen contract v1 | Commit `2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a`; fixture SHA-256 `b231fa24f057ce647dbf282ed8233fc88d0bbbed579995213306edac30e65d44`. All five vendor files unchanged. |
| Interrupted example | Stale synthetic `lock_ack=received`; authored host candidates `partial` and `locked`. Neither is independently demonstrated physically possible. Truth, observation and command remain separate. No voltage trace, probabilities, outcomes or release recommendation are invented. |
| Approved hero, film and vision image | Existing assets, unchanged; retain their concept labels. No concept frame is used as CAD or as an identical physical system. |

The visible caption labels the spatial study as explanatory, unverified and not
to scale. Separation has its own explicit caption. Source receipt and missing
evidence remain in the reading surface. No additional media, font, model, texture,
sound, generated bitmap or dependency was added.

Reiyah's source and two actual historical captures were inspected read-only;
their paths and exact source revision are in UI 007. No reference asset is copied
into CARTAN. Sentinel and Nisayon findings remain in the
[reference review](interior-reference-review-2026-11-23.md). The prior
[provenance supplement](interior-provenance-2026-11-23.md) remains historical for
UI 006's drawing, not authority for this mesh.
