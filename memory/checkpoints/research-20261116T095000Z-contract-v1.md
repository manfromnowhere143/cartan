# Research contract v1 handoff

Owner: research. Branch: `research/architecture`. Status: frozen for consumption;
UI consumption and integration are not verified. Recorded 16 November 2026.

Architecture source commit: `191b4be`.
Contract-only commit: `2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a`.
Schema: `1.0.0`, JSON Schema draft 2020-12.
Manifest: `contracts/cartan/v1/SHA256SUMS.json`, SHA-256
`6a20a83c78b8f763a4bc83d7f01e819191b1af162f8a484683841962dcf63697`.

Committed artifacts: `README.md`, `schema.json`, `fixture.json`, `validate.py`
and `SHA256SUMS.json` in `contracts/cartan/v1/`. The manifest lists each payload
digest. The fixture is `synthetic_fixture`, marked `SYNTHETIC FIXTURE — NOT EVIDENCE`.
No actual experiment or controller ran to generate it. Geometry is explicitly
missing; mass and outcomes are unmeasured. No performance result is available here.

Executed check:

```sh
python3 contracts/cartan/v1/validate.py contracts/cartan/v1/fixture.json --self-test --manifest
```

Result: valid; 16 negative controls rejected. Known false and zero also accepted.
This checks data consistency only. Uses existing `jsonschema==4.26.0`; no install.
Git initially could not write the shared index under sandboxing; the authorized
Git operation then completed through escalation. No safeguards were weakened.

UI should obtain these committed files using `git show` from its own checkout,
verify the manifest and display the mode and missing-data states. Example:

```sh
git show 2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a:contracts/cartan/v1/README.md
```

Do not consume mutable research files or overwrite frozen v1. Propose changes in
the UI lane's own checkpoint. No root-manifest ownership handoff or UI merge has
occurred. Next research work: bounded abstract-model verification, separately
labeled from this fixture; realistic comparator evaluation awaits interface data.
