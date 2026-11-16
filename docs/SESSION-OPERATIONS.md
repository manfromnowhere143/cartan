# CARTAN session operation and recovery

Owner: the existing setup session. Reviewed 16 November 2026. This canonical
file describes launch behavior and continuity; it does not supersede a lane's
scientific findings, current task, or Daniel's latest instructions.

Current operator-selected mode is **full access / YOLO** for every installed name,
lane and start/resume path. Codex bypasses approval/sandbox and hook-trust prompts
and enables live search. Claude uses permission bypass and a disabled sandbox.
This explicit 16 November correction supersedes the original restrictive setup
defaults. Already-running clients are not changed by updating the launcher.

Runtime authority is the installed canonical launcher: explicit Codex CLI flags
and `-c` values, and Claude's `config/claude-full-access.json` plus bypass flags.
The older `.codex/config.toml` / `.claude/settings.json` snapshots are retained
unchanged to preserve active sessions. Do not infer the runtime mode from those
snapshots alone. The `permissions` section of `--check` shows the launch policy.

## Start or resume from any ordinary terminal

```sh
cartancodes --check             # offline local preflight; no model
cartancodes                     # new research session
cartancodes ui                  # new UI session
cartancodes resume              # native picker for existing research sessions
cartancodes ui resume           # native picker from the UI worktree
cartancodes ui resume --check   # inspect the resume plan without resuming
```

`cartan-codex` is equivalent. Replace it with `cartanclaudes` or `cartan-claude`
for Claude after its ordinary `claude auth login` flow. Claude authentication is
separate from Codex. All four spellings select the canonical installed launcher.
Multiple terminals are supported; no lane lock, active-process termination,
automatic checkout, dependency installation or implicit resume is performed.

Resume delegates to the installed client's picker. Codex's default picker filters
by working directory; this launcher does not request `--all` or `--last`. Select
the intended conversation and check its displayed project. Claude uses its own
`--resume` picker. No new research prompt is injected into a resumed conversation.
Current full-access and MCP arguments are still supplied. Actual restoration of
a conversation has not been exercised by setup because that starts a model
session. Check the live session's status before continuing work.

New-session prompts point to this file and canonical `docs/SESSION_HANDOFF.md`.
An active worktree may retain older setup notes and launcher source. Its installed
command still uses `~/workspace/cartan/scripts/launch.py`. Do not merge or rewrite
an active worktree just to refresh setup prose. A resumed conversation should read
these canonical setup records once, then continue its own latest checkpoint.

## First working block

1. Read the lane's AGENTS, handoff, coordination and memory index, the canonical
   setup records, and its assigned research or UI prompt. Resolve dated claims
   against their sources; do not call an unread paper inspected.
2. Verify the selected worktree, branch and pending changes without resetting
   anything. Identify the current task and files owned by this session. Another
   terminal is allowed; coordinate overlapping edits as normal.
3. Inspect native status and the actual tools offered. Codex preflight expects
   `openaiDeveloperDocs`, `node_repl` and `cua_repl`; Claude declares only the docs
   MCP. Presence in configuration is not a connection test. The shell, hosted web
   tools, MCP and browser bridges have different access paths and controls.
4. For the first task needing each capability, retain one bounded observation:
   a public documentation query; a primary-source page with date/identifier; or
   a disposable browser page the session owns. Do not navigate, close or change
   unrelated browser tabs. Record unavailable tools and continue independent work.
5. State the next useful deliverable, falsification/check criteria and resource
   bounds. Use the existing task authority for routine reversible work. Paid jobs,
   new services, publication and physical action still need their own authority.

## Continuity during work

Keep source/claim records and implementation artifacts in the owning worktree.
After a meaningful result, before a long operation or anticipated context
compaction, and before ending, write a uniquely named checkpoint under
`memory/checkpoints/`. This is a working protocol, not an installed automatic
hook. Native conversation storage alone does not retain validated project state.

```text
Owner / lane / UTC:
Task and status:
Branch and source commit:
Changed or untracked artifacts still to preserve:
Sources inspected (exact version, URL/path, access date; hashes for retained files):
Result and scope of evidence:
Tests actually executed and outcomes:
Failed attempts, counterevidence, unknowns and superseded notes:
Resource use / remaining bound:
Next concrete action; dependency or decision if blocked:
```

Search existing notes before repeating work. Keep failed/null outcomes, source
versions, units and uncertainty. A summary is not an independent check. Reproduce
the decisive result from its retained inputs before claiming it verified. Move to
another permitted question when a tool or input blocks one part of the task;
avoid repeating the same failed request. No automatic retry loop, scheduler,
cross-project memory service or recurring paid mission is installed.

Research owns the evidence contract; UI uses a named version and retained hash
manifest, or clearly labeled local synthetic fixtures until it exists. Follow
`docs/COORDINATION.md` for contract-only integration. Scientific and UI validation
must be written by the future lanes against the chosen model and implementation;
environment tests cannot establish those results.

## Recover and maintain

If a terminal closes, run the lane's `resume` command and select its conversation.
Read its checkpoint and inspect pending files. Do not remove lock files, kill
other sessions, reset a worktree or assume another terminal owns a stale PID.
The launcher does not use locks. Resume does not transfer ownership of another
session's unfinished work.

For an upgraded client, changed plugin set, changed input packet or new service,
the setup owner reviews the actual difference first. Compare installed `--help`,
credential source, tool scope and configuration precedence; then update the
appropriate pins/manifests after verification. Never update a hash or pin merely
to silence a failure. Current paths are Mac-specific and the environment inherits
machine model/plugins; this is a reproducible local procedure, not a portable
hermetic image. Document any model/effort change used for a research run.

Safe checks from the canonical root:

```sh
python3 scripts/install_launchers.py --check
python3 scripts/test_environment.py
cartancodes --check
cartancodes ui --check
cartancodes resume --check
cartanclaudes --check
```

The regression suite uses temporary worktrees and harmless local probes. It also
reads installed client versions, local auth and effective Codex MCP configuration;
auth/config inspection denies network. It does not start inference. Preflight
exit 2 can mean missing authentication or a configuration discrepancy; read the
reported cause. Review active lane ownership before synchronizing setup files.

Capability coverage and remaining acceptance work are recorded in
`docs/SETUP-COMPARISON-2026-11-16.md`.
