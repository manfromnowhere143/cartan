# CARTAN

Environment foundation for spacecraft serviceability research and its visual
laboratory. This repository currently contains setup and coordination, not a
product or validated engineering result.

Start with [the handoff](docs/SESSION_HANDOFF.md),
[environment audit](docs/ENVIRONMENT-AUDIT.md), and
[verification record](docs/VERIFICATION.md). The
[comparison with prior setups](docs/SETUP-COMPARISON-2026-11-16.md) records both
improvements and remaining gaps; the [operating guide](docs/SESSION-OPERATIONS.md)
covers continuity, resume and maintenance.

```sh
cartancodes --check
cartancodes              # future research session
cartancodes ui           # future UI session, separate worktree
cartancodes resume       # choose an existing research conversation
cartancodes ui resume    # choose an existing UI conversation
```

Canonical spellings: `cartan-codex` and `cartan-claude`. Compatibility spellings:
`cartancodes` and `cartanclaudes`. Both accept `[research|ui] [resume] [--check]`
and default to a new research session. `--check` never starts a model, installs packages or connects MCP.
It checks stored local authentication with network denied and returns exit 2 if
login is missing. Codex also parses its effective MCP configuration offline.
Use a normal interactive terminal to launch. Multiple terminals are supported;
coordinate file ownership when sessions share a worktree.

Claude requires its own login; the setup check found none. Use the installed
client's ordinary authentication flow before choosing it. Existing Codex login
state does not authenticate Claude. Direct `codex` or `claude` commands do not
apply all CARTAN launcher controls.

No product dependencies are installed or prescribed. Python 3.11+, Git, installed
Codex/Claude binaries and the retained handoff folder are the setup prerequisites.
The launcher records audited client versions and refuses unreviewed version drift.
