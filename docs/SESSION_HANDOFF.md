# CARTAN environment handoff

**Current permission policy: full access / YOLO, explicitly required by Daniel on
16 November 2026.** This supersedes the original packet and earlier setup records
that retained sandboxing and approval prompts. All four installed names use the
new policy for both research/UI and start/resume:

- Codex: `--dangerously-bypass-approvals-and-sandbox`,
  `--dangerously-bypass-hook-trust`, live search; explicit overrides also select
  `approval_policy="never"` and `sandbox_mode="danger-full-access"`.
- Claude: `--dangerously-skip-permissions --permission-mode bypassPermissions`,
  with `sandbox.enabled=false` in the new canonical
  `config/claude-full-access.json`.

Existing sessions are not restarted or reconfigured. Use a new normal-terminal
invocation, or exit the intended session normally and use `cartancodes resume`
(`cartancodes ui resume` for UI) to launch it with the new policy. The retained
project settings files are historical snapshots, overridden by the launcher;
they are not the effective mode of new CARTAN launches. Global settings, source
inputs and active worktrees are untouched by this correction.

Current comparison review: start and resume plans were
checked through all four installed names in fresh login shells. Native resume is
now available with `cartancodes [ui] resume`; no model conversation was started or
resumed by setup. New sessions read this canonical handoff and
`docs/SESSION-OPERATIONS.md`, so active worktrees can retain their existing setup
snapshot. See `docs/SETUP-COMPARISON-2026-11-16.md` for the comparative verdict,
MCP coverage and outstanding runtime checks.

16 November operator correction: the unsolicited one-session-per-lane lock has
been removed. `cartancodes` can open another terminal session while an existing
session runs. Installed commands use the updated canonical launcher; active lane
files and processes were not changed. The full-access correction above is newer
than the lock-removal correction and controls current permission behavior.

Prepared 16 November 2026. Environment setup only; this setup session has not
started a research or UI build session. Read `docs/ENVIRONMENT-AUDIT.md` and `docs/VERIFICATION.md` for
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
are not tested. Local Codex start/resume preflights and both terminal spellings
passed. Claude preflight returns an explicit
auth-required exit. The next
operator action can be `cartancodes` in a normal terminal, or `cartancodes ui`
for the UI lane. See `docs/VERIFICATION.md` for the exact readiness limits.

The documentation MCP's public endpoint answered direct initialization and tool
listing from this Mac. Browser bridges and full future-client MCP discovery remain
unverified. Scientific retrieval is not supplied by the OpenAI docs MCP; current
source access and meaningful checkpoint recovery still need normal-session evidence.
Nisayon currently has richer automated continuity. No unattended scheduler is installed.
