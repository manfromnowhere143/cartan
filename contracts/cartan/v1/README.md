# CARTAN contract 1.0.0

Research owns this contract. JSON Schema draft 2020-12 defines Component, Claim,
Scenario, Run, Asset and supporting records. `fixture.json` is hand-authored
synthetic data for UI development; its outcomes are unmeasured. No experiment
or controller execution produced it. Always display its `display_notice`.

`mode` distinguishes illustration, synthetic fixture, simulation and physical
test. `evidence_scope` prevents a fixture from being presented as evidence.
Simulation can describe a model only; physical-test mode alone does not establish
qualified hardware, valid measurements or flight readiness. Validation checks
shape and consistency, not scientific validity or permission to publish.
`acceptable_completion` refers only to a run's declared modeled/tested outcomes;
unmeasured hazards remain unresolved and no general safety verdict is implied.

Every datum has status, value, unit and basis. Unknown, missing, unmeasured,
not applicable and explicit null use JSON null with distinct tags. Only `known`
can carry a value; zero and false are valid known values. `unit: "1"` means
dimensionless, `category` means categorical, and `sha256` is a digest. Do not
coalesce null into zero, false or success. No confidence probabilities are implied.

Trace time is seconds relative to a run. The UTC start/end values describe record
creation or execution; fixture times are explicitly synthetic. Observation
acquisition, arrival and epoch are distinct. Truth, reports, commands and possible
states have separate series. A report can be valid in format and false in content.
Empty candidate sets are inconsistent, not permission to proceed.

Asset availability, digest, rights, approval and scientific status are independent.
Missing geometry is an intentional record; it is not permission to invent approved
mechanical geometry. UI may use a visibly local illustration adapter under its own
ownership. Stable component/source IDs should survive presentation changes.

Run from the repository root, with the already available `jsonschema==4.26.0`:

```sh
python3 contracts/cartan/v1/validate.py contracts/cartan/v1/fixture.json --self-test --manifest
```

`SHA256SUMS.json` freezes every file in this directory except itself. The handoff
checkpoint records the commit and manifest digest. Consume with
`git show <contract-commit>:contracts/cartan/v1/<file>` into the UI's own lane.
Do not consume mutable files in the research worktree. No UI merge or handoff
consumption is asserted by publishing the local commit.

Frozen 1.0.0 bytes must not silently change. Compatible additions get a new
explicitly versioned artifact and reviewed compatibility checks; breaking semantic
or shape changes require v2 and an adapter. A correction is a successor, never
an overwrite of the handed-off artifact.
