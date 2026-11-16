# Environment verification

Operator correction, 16 November 2026: removed the one-session-per-lane lock.
The installed `cartancodes --check` passed from outside the repository, and all
25 updated tests passed (4.727 seconds), including launching harmless local
processes while an older lane lock is held. No model was launched, active
worktree updated, existing session stopped, or permission setting changed.
The original setup results below are retained with the concurrency correction.

Date: 16 November 2026. **Codex is prepared for Daniel's first interactive
session. Claude is configured but blocked on authentication.** This is a local
environment verdict, not an end-to-end model-session or product-readiness claim.

## Exact commands

In an ordinary interactive terminal, from any directory:

```sh
cartancodes --check       # local preflight, no model session
cartancodes               # research / backend architecture session
cartancodes ui            # separate UI / visual-laboratory session
```

Equivalent Codex name: `cartan-codex`. No shell file needs sourcing; the commands
are executable symlinks in the already-resolved `~/.local/bin` directory. If an
older zsh has cached command lookup, `rehash` refreshes it. The absolute fallback
is `/Users/danielwahnich/.local/bin/cartancodes`.

Claude uses the same lane selection:

```sh
claude auth login        # Daniel performs the normal client login himself
cartanclaudes --check
cartanclaudes            # research lane, after login
cartanclaudes ui          # UI lane, after login
```

Equivalent Claude name: `cartan-claude`. Multiple terminal sessions are allowed,
including the same lane. Coordinate file ownership for shared worktrees. Neither
client is recursively started by setup or by the other session.

## Verified local results

| Check actually executed | Observed result |
|---|---|
| Installed client help and versions | Codex CLI 0.169.0; Claude Code 2.1.302; selected flags supported by their installed help |
| Python, JSON, TOML parsing | All setup scripts and config parse; no package installation required |
| `python3 scripts/test_environment.py` | 24 tests passed; final retained log reports 6.529 seconds |
| Guard positive/negative controls | Correct client/lane plans; wrong Git family, wrong/detached branch, remote drift, missing/symlinked instructions, config/input drift, corrupt JSON, missing client and version drift rejected |
| Credential and environment behavior | Synthetic canaries not echoed/forwarded; Git-routing and shell-injection environment variables filtered; existing terminal proxy settings retained |
| Work preservation and concurrency | Dirty work preserved; the initial exclusive lock was removed following Daniel's correction. Regression checks use harmless local processes with an older lock held; no model is launched |
| Installer collision | Existing command file preserved; no partial overwrite |
| Dry-run behavior | No model launch path entered; no MCP adapter started; native config/auth diagnostics run with OS network denied |
| Native Codex effective config | Parsed successfully in actual research and UI worktrees; enabled `openaiDeveloperDocs`, `node_repl`, `cua_repl`; Aweb, email, research Google, legacy computer-use and codex_app disabled |
| Existing docs MCP | A read-only `list_api_endpoints` call through the already-connected documentation tool completed; this does not prove future client discovery |
| Cold interactive login zsh resolution | All four CARTAN names resolve to `~/.local/bin` symlinks targeting the canonical `scripts/launch.py`; `python3` resolves to `/opt/homebrew/bin/python3` |
| Actual installed terminal entry points | `cartancodes --check` and `cartan-codex ui --check` exit 0 from `/private/tmp`; both resolve correct cwd, branch, instructions and all 12 input hashes |
| Claude terminal entry points | `cartanclaudes --check` and `cartan-claude ui --check` resolve correct lanes and inputs, then return exit 2 because no stored login was detected |
| Preservation | All 37 hash-recorded pre-existing launcher/config/instruction/input files unchanged at comparison; no secret-file backups made |
| Git | Local-only repository; configured human author/committer retained; no model trailers; no remote, push or publication |

The native client checks exposed actual compatibility issues during development:
Codex does not accept `--strict-config` on its MCP management subcommand, although
it supports it for interactive launch. CLI dotted-key quoting also differs from
TOML file quoting. The corrected configuration passed native parsing. Strict
interactive validation remains enabled; it was not weakened to make the diagnostic
pass. Incomplete disabled-server stubs are not used. Existing browser lifecycle
hooks retain their servers instead of being silently broken to reduce a tool list.

## Locations and next prompts

| Purpose | Path / branch |
|---|---|
| Setup source and single launcher owner | `/Users/danielwahnich/workspace/cartan`, `setup/environment` |
| Research session | `/Users/danielwahnich/workspace/cartan-worktrees/research`, `research/architecture` |
| UI session | `/Users/danielwahnich/workspace/cartan-worktrees/ui`, `ui/visual-laboratory` |
| Original handoff inputs | `/Users/danielwahnich/Documents/CARTAN-Handoff-2026-11-16/cartan-monday-audit-2026-11-16` |
| Private setup receipts and logs | `/Users/danielwahnich/Documents/CARTAN-Environment-Setup-2026-11-16` |

Research launches point to `CARTAN-01-Backend-Research-Prompt.txt`; UI launches
point to `CARTAN-02-Frontend-Visual-Laboratory-Prompt.txt`, both in the original
handoff folder. The initial session prompt explicitly requires reading the
repository instructions and assigned file. No claim is made that either future
session has already consumed them.

## Limits, blockers and remaining decisions

- **Claude authentication is missing.** No new login, OAuth grant, credential or
  account was created. The launcher refuses to start it until local auth passes.
- **Remote model access/quota remains untested for both clients.** No paid model
  request was made. Codex's stored ChatGPT login is a local prerequisite, not a
  claim of successful inference. Workspace/hook trust may prompt on first launch;
  the setup never accepts those prompts on Daniel's behalf.
- **Claude interactive settings/MCP discovery remains untested.** Its native
  `mcp list` reported no configured servers when supplied launch-only flags;
  therefore that command is not treated as proof that its session config works.
  JSON/setting structure and supported flags were checked, but after login the
  first Claude session must inspect `/mcp`, permissions and `/sandbox`. Do not
  weaken them if something fails.
- **Native UI bridges remain untested.** Node/CUA adapters are retained for
  existing cleanup hooks; no browser/app was opened or controlled and no macOS
  permission was granted. Availability and action authorization are separate.
- **No engineering dependencies or scientific contracts were invented.** Research
  must complete source reading and architecture choices before selecting a stack
  or implementing the v1 contract. UI must establish asset approval/rights and
  consume that contract or visibly local synthetic fixtures.
- **Remote, hosting, additional MCP and budget decisions remain open.** No GitHub
  remote, hosting service, cloud spend, hardware action, generation or outreach is
  authorized by this setup. Models and effort inherit existing client preferences.

## Exact additions and backups

The repository additions are:

```text
.gitignore
.codex/config.toml
.claude/settings.json
AGENTS.md
CLAUDE.md
README.md
cartan.json
config/environment.json
config/inputs.json
config/claude-mcp.json
docs/COORDINATION.md
docs/ENVIRONMENT-AUDIT.md
docs/SESSION_HANDOFF.md
docs/VERIFICATION.md
memory/INDEX.md
memory/notes/2026-11-16-environment-decisions.md
scripts/install_launchers.py
scripts/launch.py
scripts/test_environment.py
```

Outside the repository: four new symlinks in `~/.local/bin`, the two new Git
worktrees, and the private receipt directory listed above. Original files were
not overwritten, so there are no replacement backups to restore. Preservation
records contain hashes and paths only, never credential contents. CARTAN revisions
are retained in local Git; the final commit/worktree identities and full changed-
file manifest are recorded in the private `final-state.json` receipt.

Reproduce checks with `cartancodes --check`, `cartancodes ui --check`,
`cartanclaudes --check`, `cartanclaudes ui --check`,
`python3 scripts/install_launchers.py --check`, and
`python3 scripts/test_environment.py` from the canonical setup root. The test
suite creates and deletes only its own temporary Git fixtures. It never launches
a model. No product build, experiment, daemon or either requested future session
has been started by setup.
