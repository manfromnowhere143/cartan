# UI consumption receipt and integration boundary

16 November 2026. Supersedes this file's earlier pending-contract proposal.
This file records consumption; it does not claim a message was delivered to,
or accepted by, the engineering session.

Engineering owns research/backend and the canonical `contracts/cartan/v1/`.
UI owns `frontend/` and its uniquely named checkpoint. Setup configuration and
all research working files are untouched.

Consumed immutable contract-only commit:
`2a4083ac15e64fbf3f6f57355827efd5d2ff0a7a`.

- Manifest SHA-256: `6a20a83c78b8f763a4bc83d7f01e819191b1af162f8a484683841962dcf63697`.
- Fixture SHA-256: `b231fa24f057ce647dbf282ed8233fc88d0bbbed579995213306edac30e65d44`.
- Version: `1.0.0`. Mode: `synthetic_fixture`; evidence scope: `none`.
- Copies: `vendor/cartan/v1/`; byte-verified against `git show` for that commit.
- Pinned input documents: `docs/engineering/specification.md` and `protocol.md`.
- Runtime record: `data/contract-pin.json`. No silent upgrades.
- Canonical validator: `python3 vendor/cartan/v1/validate.py vendor/cartan/v1/fixture.json --self-test --manifest`.
- Outcome: valid; all 16 negative controls rejected; scientific validation false.

The reader preserves command, observation, physical truth and belief separately,
including stale observations and authored fixture truth. Provenance exposes model,
controller, scenario, synthetic timestamps, input/configuration hashes, source
references, units, limitations, missing geometry and every unmeasured outcome.
Unknown, missing, unmeasured, explicit null, not applicable, zero and false remain
distinct. Hash mismatch, missing data or unsupported evidence fails to an explicit
unavailable state. The browser projection is intentionally narrower than the full
canonical validator: it accepts only this pinned synthetic example. A future
simulation integration needs its own reviewed adapter and stable artifact handoff.
Breaking schema changes need v2. No backend action is callable from this UI.

Original film assets and logo are copied with hash provenance; source files are
untouched. Concept artwork and editorial hold/reverse motion have no authority
over physical guards, mechanism order or scientific outcomes. Genuine spatial
inspection requires approved geometry, dimensions, rights and physical limits.
No editable CAD/glTF was found. Final film/pacing approval remains pending.

The local interface now uses addressable, borderless views rather than a stacked
presentation. No shared routing, package manifest, lockfile or launch change is
needed. Integration can retain the independent `frontend/` boundary.
