# Environment decisions

Owner: existing CARTAN setup session. Status: environment preparation, not a
scientific result. Sources: operator request and audited handoff dated
16 November 2026; locally inspected launcher/configuration bytes; installed CLI
help. See `docs/ENVIRONMENT-AUDIT.md` and `docs/VERIFICATION.md` for evidence limits.

Use an independent local Git repository with two owned worktrees. Keep all
original handoff inputs outside Git and hash-bound. Use one Python standard-
library launcher behind four command names; no shell function copies. Preserve
approval prompts and hook trust, explicitly override permissive Codex defaults,
and request fail-closed sandboxing in Claude. Do not create credentials or attach
sibling MCP systems. Retain hooks and their trust flow.

Scope new project MCP configuration to public documentation. Preserve inherited
Codex node_repl/cua_repl runtime adapters because installed browser plugins use
their turn_ended hooks for cleanup. Their availability is not authority to use
unrelated applications or accounts. Keep project memory as reviewable files.
Do not introduce a custom MCP server, database, distributed coordinator, framework,
container, generated architecture or dependency manager without a demonstrated
need. Research owns the first scientific contract; UI consumes committed versions.

Alternatives rejected for setup: copying Nisayon's implementation would import
its product authority and maintenance burden; cloning shell functions would
repeat precedence drift; a fresh client home would duplicate auth/config state
and could omit existing policy/hooks; a full-access switch would erase boundaries.
This is a maintainability decision, not a claim of a uniquely optimal architecture.

Next: verify actual launch planning, negative controls and effective config, then
let Daniel start the requested sessions. Remote model use remains untested by
design. No secret, safety verdict or paid-service authorization is inferred.
