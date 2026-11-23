# Operator-required full-access launch policy

Owner: setup session. Date: 16 November 2026. Status: implemented and locally
verified. Starting revision: `1fdd3c3`.

Daniel explicitly required all CARTAN aliases to open full danger-zone/YOLO
sessions like his other projects. This later instruction supersedes the original
packet's restrictive launch defaults. Do not reinterpret it as a request to keep
`workspace-write`, `on-request` or Claude manual permissions.

Codex now receives `--dangerously-bypass-approvals-and-sandbox`,
`--dangerously-bypass-hook-trust`, and `--search`, plus explicit never/full-access/
live configuration overrides. These match the inspected permission-related flags
of Sentinel/Nisayon. Claude receives `--dangerously-skip-permissions` and
`--permission-mode bypassPermissions`, with its sandbox disabled through the new
`config/claude-full-access.json`. Both lanes and native resume use the same modes.

The installed canonical launcher owns effective runtime configuration. Retained
`.codex/config.toml` and `.claude/settings.json` snapshots were deliberately not
rewritten: active worktrees and previously launched clients remain untouched.
The new-session prompt and canonical handoff record the supersession. Runtime
permission mode is included in every `--check` report and the launch banner.

Verification: 32 tests passed in 11.733 seconds; actual installed CLI help accepted
both clients' complete start/resume options. Native offline Codex MCP inspection
passed under the new overrides. The full-access test log and installed-entrypoint
receipts are retained in the existing private setup receipt directory. No model
session, job or external action was started.

Claude still needs its own login. Already-running sessions do not acquire new
argv by changing the launcher; Daniel may open a new terminal or resume an exited
conversation with the updated alias. No additional confirmation is needed to
retain this requested launch mode. Scientific claims, account availability,
MCP selection and authority for a particular external action remain separate.
