# CARTAN environment handoff

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
are not tested. See the final verification record before declaring readiness.
