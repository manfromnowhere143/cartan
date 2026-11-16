# CARTAN session handoff

## Current research state — 16 November 2026

Research block 1 is complete on `research/architecture`. Start with
[results and recommendation](../research/results.md) and the
[research checkpoint](../memory/checkpoints/research-20261116T101534Z-verification.md).
The audit/source/architecture commit is `191b4be`, frozen contract v1 is `2a4083a`,
model and frozen verification cases are `aee96ea`, and full retained evidence and
next-study design are `e162351`. Read the architecture before extending the code.

Executed: 15 known verification scenarios, 27 toy sensitivities, 12 unit tests,
contract validation/16 negative controls, and one identical-core replay. Some
scenarios intentionally contain hazards. This is abstract model verification,
not comparative performance, physical validation or flight evidence. Physical
limits, operator requirements and economic burden remain unknown. Recommendation:
narrow to whether an actual interface's ambiguity survives ordinary sensing,
interlocks and recovery; the first study is designed but unexecuted.

The contract handoff checkpoint identifies immutable bytes and consumption steps.
UI was read-only inspected, clean at the original setup commit; consumption and
integration are unverified. Setup retains launch/MCP/config ownership. No root
dependency or integration-ownership handoff occurred. No new model session,
service, paid job, hardware activity or external publication was started.

## Historical setup snapshot

The following records the state at setup completion, before the research block
above. Its pending research items are superseded by the current research state;
launcher/authentication facts were not rerun by research.

Prepared 16 November 2026. Environment setup only; no research or UI build session
has been started. Read `docs/ENVIRONMENT-AUDIT.md` and `docs/VERIFICATION.md` for
the inspected architecture, actual checks and limits.

The canonical root is `/Users/danielwahnich/workspace/cartan`. Research and UI
use separate Git worktrees under `/Users/danielwahnich/workspace/cartan-worktrees`.
This is a new local-only repository, identified after a bounded local discovery
found no existing CARTAN checkout. No remote has been fabricated or created.

Start with `AGENTS.md`, `docs/COORDINATION.md`, `memory/INDEX.md`, then the reading
list and assigned prompt resolved by `config/inputs.json`. Inputs remain outside
Git and unchanged; validate their hashes using the launcher `--check`.

The setup session retains launch/MCP ownership. Research is the designated future
integration owner for root manifests and lockfiles after a recorded ownership
handoff. UI owns only its isolated frontend boundary. No product dependencies,
scientific schemas or implementation are supplied by setup.

Pending: research architecture and contract v1; UI asset and rights inventory;
remote/repository visibility decision; any additional MCP approval; an explicit
resource budget for paid work. Claude's local authentication check reported not
logged in. Codex reports a stored ChatGPT login; remote model access and quota
are not tested. Local Codex preflight and both terminal spellings passed; 24 guard
tests passed. Claude preflight returns an explicit auth-required exit. The next
operator action can be `cartancodes` in a normal terminal, or `cartancodes ui`
for the UI lane. See `docs/VERIFICATION.md` for the exact readiness limits.
