# CARTAN visual laboratory

Local-only, buildless HTML/CSS/JavaScript. From the UI worktree root:

```sh
python3 frontend/qa/preview_server.py 4178
```

Open http://127.0.0.1:4178. Stop the owned server with Ctrl-C after review.
No dependency installation, root configuration or public hosting is required.

The interface has one active view: opening, research, component study, state
inspection, evidence, comparisons, sources or long-term vision. Floating controls
replace decorative borders, dividers and the earlier stacked presentation.
Links preserve deep linking and browser Back. Escape returns to the containing
view; the film uses its native dialog dismissal. Reading can scroll inside a long
view, especially at large zoom. Inactive views are hidden and inert. Without the
router, all content remains readable as ordinary document sections.

The eligible desktop hero plays the supplied silent 19-second sequence once,
forward, then fades to its poster over 250ms. Pause preserves the position; Replay
is explicit. Hidden/offscreen media pauses without automatic resumption. Mobile
below 768px, portrait/narrow framing, reduced motion and Save-Data attach no hero
video source. Mobile uses the supplied portrait poster. Autoplay failure leaves
the poster and an optional Play control; browsers without a policy query may have
requested metadata before rejecting play. The 21.5-second full film loads only
when its viewer opens, remains paused until Play, and includes its disclaimer in
HTML. No audio track is present. Daniel selects any future soundtrack.

Page changes apply immediately and add a brief reveal only in a focused, visible
window. Missing media retains text and navigation. This is a concept presentation,
not one continuous validated mechanism. The engineering contract is unchanged.

Engineering v1 is pinned to commit
`2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a`. The vendor files are byte-preserved
copies, not a competing contract. `contract-adapter.mjs` checks the fixture's
SHA-256 before rendering. The single fixture is hand-authored and prominently
marked **SYNTHETIC FIXTURE — NOT EVIDENCE**. All outcomes remain unmeasured.
The old frontend-local fixture is retained only for adapter tests. No mutable
research output, physical result or simulation replay is loaded.

```sh
node --test frontend/tests/*.test.mjs
node --check frontend/app.mjs
python3 frontend/vendor/cartan/v1/validate.py frontend/vendor/cartan/v1/fixture.json --self-test --manifest
```

The canonical validator requires Python's `jsonschema`, already present on the
reviewed machine. It does not establish scientific validity.

See `docs/ADR-UI-002-revised-hero.md`, `qa/REVIEW-REVISED-HERO-2026-11-16.md`,
`docs/ADR-UI-001.md`, `docs/asset-registry.json`,
`docs/ENGINEERING-HANDOFF-PROPOSAL.md` and `qa/REVIEW-2026-11-16.md` for decisions,
provenance, the consumption receipt and actual verification limits. Supplied films
are concept review assets; final human approval remains open. No CAD/glTF,
validated kinematics, flight hardware, measured advantage or production release
is claimed. No generation, soundtrack, analytics, backend or deployment is added.
