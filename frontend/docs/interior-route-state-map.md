# Interior route and state map

Owner: UI. Baseline `dcc8d8e`; local candidate, 23 November 2026.

| Crawlable path | Purpose and retained context | Default return |
| --- | --- | --- |
| `/` | Approved opening, original media and controls | Main navigation |
| `/laboratory/` | Persistent module schematic; select module, retention, isolation or support | Interface → part → module → overview |
| `/interruption/` | Same schematic; stale report and the two authored fixture possibilities | Selected interface |
| `/evidence/` | Exact fixture identity, unknowns and separate evidence categories | Paused transfer when entered from it; otherwise overview |
| `/research/` | The question, with the module still in context | Overview |
| `/comparison/` | B0/B1/B2/C and what a comparison would need | Evidence |
| `/sources/` | Source-reported work, with links and scope boundaries | Research |
| `/vision/` | Existing generated assembly concept, explicitly unvalidated | Overview; research link in content |

`workspace-state.mjs` parses and serializes the single state: path, `part`,
`detail=interface`, `record`, `from=interruption`. Unknown values cannot become
new domain states. Legacy `#top` and eight named hashes remain supported.
`routes.mjs` retains canonical page metadata and ignores presentation query
parameters in canonical URLs. Nothing changes the pinned scientific schema.

`app.mjs` commits the state synchronously: visibility/inertness, existing SVG group
emphasis, disclosure, contextual link URLs, evidence category, metadata and focus.
Part selection keeps focus on the actual button; opening an interface focuses its
heading; returning focuses its trigger. Browser history retains the prior control
and scroll offset. Escape follows the containing state, except inside the native
film dialog or a text-entry control. No transition promise can revive an old view.

The schematic DOM node persists through research, component, interruption,
evidence, comparison and sources. The long-term concept image remains separate;
it is never presented as the same mechanism. Long content uses normal document
scrolling; short landscape and narrow layouts remove sticky positioning. No
wheel interception, page snapping, hover dependency or idle rendering loop exists.

`contract-adapter.mjs` is byte-unchanged. It fetches and verifies the same pinned
fixture, now only on first evidence/inspection entry. Late success fills fixture
fields without navigating or moving focus; failure withholds the candidates.
`inspectionFacts` is a text projection, not a geometry or physics inference.

`hero-controller.mjs`, the complete hero/dialog event wiring, opening markup and
original `style.css` are unchanged. `focus-presentation.mjs` still handles actual
input modality. The extra `interior.css` is scoped to the interior.

The static builder reuses these state functions to generate return links, keeps
all eight prerendered views and unique metadata, and adds only two allowlisted
runtime files (`interior.css`, `workspace-state.mjs`). No-JS users can read all
component notes, the static uncertainty explanation, source fixture and evidence
boundary. Selection controls are hidden when they cannot operate. The actual
404, original aliases, structured data/CSP and package limit remain.

QA: core state tests, isolated application DOM tests, immutable contract negative
controls, release assertions, local HTTP checks and a browser harness. The harness
is excluded from the release and does not constitute an executed browser test.
