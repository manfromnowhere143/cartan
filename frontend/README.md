# CARTAN visual laboratory

Current local candidate (23 November, UI 009): a white workspace by default, a
saved light/dark switch, full-contrast text and clearer spatial selection. The
scene now uses the shared pointer/keyboard focus policy, fixing its persistent
pointer outline; interrupted camera drags cancel on capture loss. The cinematic
opening retains its framing/media with white live text. Read
[the current review](qa/REVIEW-FOCUS-SURFACES-2026-11-23.md),
[UI 009](docs/ADR-UI-009-scene-focus.md) and
[the appearance review](qa/REVIEW-THEME-2026-11-23.md). Browser/device acceptance is open.

The interactive spatial module study
anchors one workspace, with deliberate camera views, selectable relationships,
an in-place reading surface, paused-transfer inspection and evidence. Optional
WebGL2 and an SVG fallback use the same original, unverified schematic geometry.
The approved opening and media remain byte-identical. This is **not published,
browser-accepted or GPU-accepted**. Read [the earlier spatial review](qa/REVIEW-SPATIAL-2026-11-23.md),
[UI 007](docs/ADR-UI-007-spatial-instrument.md) and
[state/provenance map](docs/spatial-instrument-map.md).

The retained baseline is `dcc8d8e`; the local candidate is served at
http://127.0.0.1:4182/ while its owned preview process is running. This replaces
the earlier spatial candidate at Daniel's existing URL. The baseline is at
http://127.0.0.1:4180/; earlier candidates remain at 4181 and 4183. Each offers
`/qa/interior-review.html`; this review
harness is never in the public package. The current review lists exact test
results and unavailable browser, phone, screen-reader and performance checks.

Dependency-free HTML/CSS/JavaScript with a static publication package. For the
existing source-level hero QA, from the UI worktree root:

```sh
python3 frontend/qa/preview_server.py 4178
```

Open http://127.0.0.1:4178. Stop the owned server with Ctrl-C after review.
No dependency installation or root configuration is required.

Build a fresh, allowlisted public package (the destination must be empty):

```sh
python3 frontend/release/build_site.py /private/tmp/cartan-release
python3 frontend/release/verify_package.py /private/tmp/cartan-release
python3 -m http.server 4180 --bind 127.0.0.1 --directory /private/tmp/cartan-release/.vercel/output/static
```

Review that package at http://127.0.0.1:4180. It contains eight prerendered
paths, unique canonical metadata, factual structured data, sitemap, robots,
manifest, favicon and a true 404. Vercel Build Output API routing and response
headers live in the generated `.vercel/output/config.json`. Deploy only this
allowlisted output to the independent `cartan` Vercel project. Never deploy the
whole repository or include QA files or local credentials in the package.
The canonical origin is https://cartan.danielwahnich.dev/. See the dated
publication report for actual live status.

The interface has one active view: opening, research, component study, state
inspection, evidence, comparisons, sources or long-term vision. Floating controls
replace decorative borders, dividers and the earlier stacked presentation.
Links preserve deep linking and browser Back. Escape returns to the containing
view; the film uses its native dialog dismissal. Reading can scroll inside a long
view, especially at large zoom. Inactive views are hidden and inert. Each public path has its own readable initial view without JavaScript. Legacy
hash links still resolve when JavaScript runs. Browser navigation changes the
active view, address and metadata without replacing the document.

The hero plays muted and inline on desktop and mobile, repeating forward with
native looping. Small screens/3G receive a 1.83MB 960×540 rendition of the same
19s sequence; desktop retains the supplied 720p original. The video layer stays
painted through loop boundaries. Pause persists during navigation; temporary
visibility/route/dialog suspension resumes only if the user had not paused.
Reduced motion, Save-Data and 2G attach no background source. Autoplay denial
keeps the poster and exposes explicit Play without retrying unrelated gestures.
Mobile presents the full frame above readable copy rather than cropping its
working area. The 21.5s full film remains independent and paused on opening.
No audio is added; Daniel selects any future soundtrack.

Page and component changes apply immediately without opacity or transform
animations. A consistent dark canvas and persistent original SVG explain component
relationships without asserting validated geometry. The old explorer artwork
is retained but no longer used in the interior. Custom line icons and restrained keyboard indicators
replace glyph controls and the former filled focus state. Missing media retains text and navigation. This is a concept presentation,
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
validated kinematics, flight hardware or measured advantage is claimed.
Daniel subsequently authorized public hosting and SEO; this does not validate
any depicted hardware. No generation, soundtrack, analytics or backend is added.

Current refinement: `docs/ADR-UI-004-stable-surface.md` and
`qa/REVIEW-STABILITY-2026-11-16.md`. The local browser matrix is
`http://127.0.0.1:4178/qa/stability-review.html` using the preview server above
(historical hero/stability coverage; use the interior harness for this candidate).
No browser results are implied merely by providing this harness.

Focus/media policy: `docs/ADR-UI-005-pointer-focus-and-responsive-motion.md`
and `qa/REVIEW-FOCUS-MOTION-2026-11-16.md`. These supersede earlier mobile-still
and single-play instructions per Daniel's current request. `focus-presentation.mjs`
tracks actual pointer/keyboard/assistive activation without removing native focus.
UI 009 extends that shared policy to custom non-editing surfaces. Every new custom
tab stop must opt into `data-focus-surface` and retain keyboard indication; text
entry/native media stay outside this contract. Run `focus-surfaces-dom.test.mjs`
with the other four DOM suites for this candidate.
The optional isolated-DOM checks use an existing jsdom installation, for example:

```sh
CARTAN_JSDOM_MODULE=/absolute/path/to/jsdom node --experimental-vm-modules --test frontend/qa/focus-dom.test.mjs
```

jsdom is QA-only and is not a runtime dependency or a substitute for device QA.
