#!/usr/bin/env python3
"""CARTAN launcher. --check is local/read-only and never executes a model.

No shell evaluation, installation, auth mutation, trust mutation, or background
server startup. Only known client/role arguments are accepted. Exit 2 means a
local prerequisite failed, never a request to weaken a safeguard.
"""

import hashlib
import json
import os
import re
from pathlib import Path
import subprocess
import sys
import tomllib

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = (
    "AGENTS.md", "CLAUDE.md", "docs/SESSION_HANDOFF.md", "docs/COORDINATION.md",
    "docs/ENVIRONMENT-AUDIT.md", "docs/VERIFICATION.md", "memory/INDEX.md",
    "cartan.json", "config/environment.json", "config/inputs.json",
    ".codex/config.toml", ".claude/settings.json", "config/claude-mcp.json",
)
OWNED_CONFIG = (
    "cartan.json", "config/environment.json", "config/inputs.json",
    ".codex/config.toml", ".claude/settings.json", "config/claude-mcp.json",
)
CLIENT_NAMES = {
    "cartan-codex": "codex", "cartancodes": "codex",
    "cartan-claude": "claude", "cartanclaudes": "claude",
}
ENV_ALLOW = {
    "HOME", "USER", "LOGNAME", "PATH", "SHELL", "TMPDIR", "TERM", "COLORTERM",
    "TERM_PROGRAM", "TERM_PROGRAM_VERSION", "LANG", "LC_ALL", "LC_CTYPE",
    "LC_TERMINAL", "LC_TERMINAL_VERSION", "XPC_FLAGS", "XPC_SERVICE_NAME",
    "__CF_USER_TEXT_ENCODING", "COMMAND_MODE", "SSL_CERT_FILE", "SSL_CERT_DIR",
    "HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "NO_PROXY", "http_proxy",
    "https_proxy", "all_proxy", "no_proxy",
}


class PreflightError(Exception):
    pass


def child_env(source=None):
    source = os.environ if source is None else source
    env = {k: v for k, v in source.items() if k in ENV_ALLOW}
    # Only this child; no global shell or account setting is changed.
    env["ENABLE_CLAUDEAI_MCP_SERVERS"] = "false"
    return env


def run(argv, cwd=None):
    try:
        p = subprocess.run(argv, cwd=cwd, env=child_env(), capture_output=True,
                           text=True, timeout=15, check=False)
    except (OSError, subprocess.TimeoutExpired):
        raise PreflightError("Required local executable unavailable or timed out.") from None
    if p.returncode:
        # Never forward arbitrary stderr, URLs, environment or credential output.
        raise PreflightError("Local prerequisite command failed; no model was launched.")
    return p.stdout.strip()


def git(root, *args):
    return run(["/usr/bin/git", "--no-optional-locks", "-C", str(root), *args])


def load_json(path):
    try:
        return json.loads(path.read_text())
    except (OSError, ValueError):
        raise PreflightError("Required JSON configuration is missing or invalid.") from None


def parse_args(name, args):
    args = list(args)
    client = CLIENT_NAMES.get(name)
    if name == "launch.py" and args and args[0] in ("codex", "claude"):
        client = args.pop(0)
    if client is None:
        raise PreflightError("Use cartancodes or cartanclaudes, optionally followed by research or ui.")
    if args == ["--help"]:
        return client, None, False, "start"
    check = False
    if "--check" in args:
        args.remove("--check")
        check = True
    action = "start"
    if "resume" in args:
        args.remove("resume")
        action = "resume"
    if not args:
        return client, "research", check, action
    if len(args) == 1 and args[0] in ("research", "ui"):
        return client, args[0], check, action
    # Do not echo unknown arguments: a mistaken argument could be a secret.
    raise PreflightError("Unsupported arguments. Use [research|ui] [resume] [--check]; no raw client flags are accepted.")


def validate_identity(root, config, lane):
    canonical = Path(config["canonical_root"]).resolve()
    if root != canonical or canonical != ROOT:
        raise PreflightError("CARTAN canonical launcher identity mismatch.")
    workspace = (root / config["lanes"][lane]["path"]).resolve()
    marker = load_json(root / "cartan.json")
    if marker != {"project": "cartan", "repository_id": "cartan-local-environment-2026-11-16",
                  "schema_version": 1, "stage": "environment-only"}:
        raise PreflightError("CARTAN repository marker mismatch; setup owner must review migration.")
    for path in (canonical, workspace):
        if Path(git(path, "rev-parse", "--show-toplevel")).resolve() != path:
            raise PreflightError("Expected exact Git worktree root.")
        common = Path(git(path, "rev-parse", "--path-format=absolute", "--git-common-dir")).resolve()
        if common != canonical / ".git":
            raise PreflightError("Worktree does not belong to CARTAN.")
        names = git(path, "remote").splitlines()
        expected = config["expected_remotes"]
        if set(names) != set(expected):
            raise PreflightError("Remote names changed; setup owner must review identity.")
        for name in names:
            if git(path, "remote", "get-url", name) != expected[name]:
                raise PreflightError("Remote identity mismatch (URL withheld).")
    branch = git(workspace, "branch", "--show-current")
    if branch != config["lanes"][lane]["branch"]:
        raise PreflightError("Wrong or detached lane branch; no checkout was changed.")
    for name in REQUIRED:
        p = workspace / name
        if not p.is_file() or p.is_symlink():
            raise PreflightError("Required lane instructions/configuration missing or symlinked.")
    for name in OWNED_CONFIG:
        if (workspace / name).read_bytes() != (canonical / name).read_bytes():
            raise PreflightError("Lane launch configuration drift; reconcile through the setup owner.")
    return workspace, branch


def validate_inputs(root):
    manifest = load_json(root / "config/inputs.json")
    base = Path(manifest["root"]).resolve()
    for entry in manifest["files"]:
        p = base / entry["name"]
        if p.parent.resolve() != base or p.is_symlink() or not p.is_file():
            raise PreflightError("Required handoff input missing or redirected.")
        if hashlib.sha256(p.read_bytes()).hexdigest() != entry["sha256"]:
            raise PreflightError("Handoff input changed; review the version before updating its manifest.")
    return base


def validate_settings(root):
    codex = tomllib.loads((root / ".codex/config.toml").read_text())
    claude = load_json(root / ".claude/settings.json")
    mcp = load_json(root / "config/claude-mcp.json")
    if codex.get("approval_policy") != "on-request" or codex.get("sandbox_mode") != "workspace-write":
        raise PreflightError("CARTAN Codex approval/sandbox policy changed.")
    if codex["sandbox_workspace_write"] != {"network_access": False, "writable_roots": []}:
        raise PreflightError("CARTAN Codex write/network scope changed.")
    if claude["permissions"]["defaultMode"] != "manual" or claude["permissions"].get("allow"):
        raise PreflightError("CARTAN Claude permission policy changed.")
    if claude["sandbox"] != {"enabled": True, "failIfUnavailable": True,
                            "autoAllowBashIfSandboxed": False, "allowUnsandboxedCommands": False}:
        raise PreflightError("CARTAN Claude sandbox policy changed.")
    if mcp != {"mcpServers": {"openaiDeveloperDocs": {
            "type": "http", "url": "https://developers.openai.com/mcp"}}}:
        raise PreflightError("CARTAN MCP scope changed; review before use.")
    return codex


def codex_overrides(root, project):
    # Read configuration only. Never copy credentials or execute MCP commands.
    user_path = Path.home() / ".codex/config.toml"
    user = tomllib.loads(user_path.read_text()) if user_path.exists() else {}
    system_path = Path("/etc/codex/config.toml")
    system = tomllib.loads(system_path.read_text()) if system_path.exists() else {}
    names = set().union(*(d.get("mcp_servers", {}) for d in (system, user, project)))
    overrides = {
        "sandbox_workspace_write.network_access": "false",
        "sandbox_workspace_write.writable_roots": "[]",
        "shell_environment_policy.inherit": '"core"',
        "apps._default.enabled": "false",
    }
    for d in (system, user, project):
        for name in d.get("apps", {}):
            if not re.fullmatch(r"[A-Za-z0-9_-]+", name):
                raise PreflightError("An app identifier needs explicit configuration review.")
            overrides[f"apps.{name}.enabled"] = "false"
        docs = d.get("mcp_servers", {}).get("openaiDeveloperDocs", {})
        if set(docs) - {"url", "enabled"} or docs.get("url", "https://developers.openai.com/mcp") != "https://developers.openai.com/mcp":
            raise PreflightError("Documentation MCP configuration changed; review its endpoint and credential scope.")
    for name in names:
        if not re.fullmatch(r"[A-Za-z0-9_-]+", name):
            raise PreflightError("An MCP identifier needs explicit configuration review.")
        # Installed Chrome/browser cleanup hooks call node_repl.turn_ended.
        # Preserve their adapter and trust flow rather than disable a hook's server.
        overrides[f"mcp_servers.{name}.enabled"] = "true" if name == "node_repl" else "false"
    # The allowed endpoint was checked above; no command or headers are inherited.
    overrides['mcp_servers.openaiDeveloperDocs.enabled'] = "true"
    overrides['mcp_servers.openaiDeveloperDocs.url'] = '"https://developers.openai.com/mcp"'
    return [part for key, val in overrides.items() for part in ("-c", key + "=" + val)]


def local_auth(client, executable, workspace):
    args = [str(executable), "login", "status"] if client == "codex" else [
        str(executable), "auth", "status", "--json"]
    try:
        p = subprocess.run(["/usr/bin/sandbox-exec", "-p", "(version 1)(allow default)(deny network*)", *args], cwd=workspace, env=child_env(), capture_output=True,
                           text=True, timeout=15)
    except (OSError, subprocess.TimeoutExpired):
        return {"local_login_detected": False, "status": "check unavailable", "remote_access": "untested"}
    if client == "claude":
        try:
            logged_in = p.returncode == 0 and json.loads(p.stdout).get("loggedIn") is True
        except ValueError:
            logged_in = False
    else:
        logged_in = p.returncode == 0
    return {"local_login_detected": logged_in,
            "status": "stored login detected" if logged_in else "login required or unavailable",
            "remote_access": "untested"}


def validate_native_codex(base_argv, workspace):
    # Native mcp list reads effective config. Deny all network for this check.
    # --strict-config is supported by interactive launch, not this subcommand.
    inspect = [arg for arg in base_argv if arg != "--strict-config"] + ["mcp", "list", "--json"]
    raw = run(["/usr/bin/sandbox-exec", "-p", "(version 1)(allow default)(deny network*)", *inspect], cwd=workspace)
    try:
        servers = json.loads(raw)
        enabled = sorted(s["name"] for s in servers if s.get("enabled"))
    except (ValueError, TypeError, KeyError):
        raise PreflightError("Native Codex MCP inspection could not be parsed.") from None
    if enabled != ["cua_repl", "node_repl", "openaiDeveloperDocs"]:
        raise PreflightError("Effective Codex MCP set changed; review plugin and service scope before launch.")
    return {"parser": "installed Codex mcp list", "enabled_servers": enabled,
            "network": "denied by OS during inspection", "remote_connection": "not tested"}


def make_plan(client, lane, root=ROOT, action="start"):
    if action not in ("start", "resume"):
        raise PreflightError("Unsupported session action.")
    config = load_json(root / "config/environment.json")
    workspace, branch = validate_identity(root, config, lane)
    inputs = validate_inputs(root)
    project = validate_settings(root)
    spec = config["clients"][client]
    executable = Path(spec["path"])
    if not executable.is_file() or not os.access(executable, os.X_OK):
        raise PreflightError("Selected client is not installed at the audited path.")
    version = run([str(executable), "--version"])
    if version != spec["version"]:
        raise PreflightError("Client version changed; rerun compatibility checks before updating its pin.")
    prompt = inputs / config["lanes"][lane]["prompt"]
    setup_context = [root / "docs/SESSION_HANDOFF.md", root / "docs/SESSION-OPERATIONS.md"]
    if any(not path.is_file() or path.is_symlink() for path in setup_context):
        raise PreflightError("Current canonical setup context is missing or redirected.")
    initial = (f"CARTAN {lane} session. Read AGENTS.md, docs/SESSION_HANDOFF.md, "
               "docs/COORDINATION.md and memory/INDEX.md first. For current launch behavior "
               f"and setup status, also read {setup_context[0]} and {setup_context[1]}; "
               "these setup records supersede older setup notes in this worktree, not "
               "lane research findings or current operator instructions. Then read and follow "
               f"the exact assigned prompt at {prompt}. Research and explicit architecture "
               "decisions precede implementation. Setup owns launch configuration; do not "
               "edit global shell/MCP settings or start another model session.")
    if client == "codex":
        base_argv = [str(executable), "--no-daemon", "--strict-config", "-C", str(workspace),
                "--sandbox", "workspace-write", "--ask-for-approval", "on-request",
                *codex_overrides(root, project)]
        argv = ([base_argv[0], "resume", *base_argv[1:]] if action == "resume"
                else [*base_argv, initial])
    else:
        base_argv = [str(executable), "--permission-mode", "manual", "--no-chrome",
                "--settings", str(root / ".claude/settings.json"),
                "--mcp-config", str(root / "config/claude-mcp.json"),
                "--strict-mcp-config"]
        argv = [*base_argv, "--resume"] if action == "resume" else [*base_argv, initial]
    native = validate_native_codex(base_argv, workspace) if client == "codex" else {
        "parser": "JSON/TOML plus installed CLI version/flags",
        "interactive_settings_and_mcp": "not tested; claude mcp list ignores launch-only config"}
    auth = local_auth(client, executable, workspace)
    return {"client": client, "lane": lane, "action": action, "cwd": str(workspace), "branch": branch,
            "version": version, "executable": str(executable),
            "resolved_executable": str(executable.resolve()), "argv": argv,
            "prompt_file": str(prompt), "input_hashes": "verified",
            "instructions": [str(workspace / n) for n in REQUIRED[:7]],
            "current_setup_context": [str(path) for path in setup_context],
            "resume_behavior": "native picker; no new task prompt or automatic session selection",
            "worktree_state": "dirty (preserved)" if git(workspace, "status", "--porcelain=v1") else "clean",
            "configured_mcp_allowlist": (config["mcp_allowlist"] if client == "codex"
                                         else ["openaiDeveloperDocs"]),
            "inherited_runtime_adapters": ("node_repl and plugin-provided cua_repl retained for lifecycle hooks; UI use requires task authority"
                                          if client == "codex" else "none added by CARTAN; native tools require live verification"),
            "authentication": auth, "native_configuration_check": native,
            "launch_prerequisites_met": auth["local_login_detected"],
            "remote_connectivity": "not checked by dry-run",
            "hooks": "inherited; no hook-trust bypass or disable flags",
            "model_started": False}


def launch_interactive(plan):
    if os.environ.get("CODEX_THREAD_ID") or os.environ.get("CLAUDECODE"):
        raise PreflightError("Nested launch refused. Daniel should use an ordinary terminal.")
    if not sys.stdin.isatty() or not sys.stdout.isatty():
        raise PreflightError("Interactive terminal required; unattended model launches are not supported.")
    print(f"CARTAN {plan['lane']} | {plan['client']} | {plan['cwd']}\n"
          "Approvals retained. No setup command authorizes spend or publication.", flush=True)
    if plan.get("action") == "resume":
        print("Select the intended existing session; current setup notes: "
              f"{ROOT / 'docs/SESSION_HANDOFF.md'}", flush=True)
    process = subprocess.Popen(plan["argv"], cwd=plan["cwd"], env=child_env())
    while True:
        try:
            return process.wait()
        except KeyboardInterrupt:
            # Terminal SIGINT also reaches this foreground child. Never signal
            # another launcher or inspect/delete an older session's lock.
            continue


def main():
    client, lane, check, action = parse_args(Path(sys.argv[0]).name, sys.argv[1:])
    if lane is None:
        print("Usage: cartancodes|cartanclaudes [research|ui] [resume] [--check]\n"
              "Default: new research session. resume opens the native session picker.\n"
              "--check validates local prerequisites without a model launch.")
        return
    plan = make_plan(client, lane, action=action)
    if check:
        print(json.dumps(plan, indent=2))
        return 0 if plan.get("launch_prerequisites_met", False) else 2
    if not plan["launch_prerequisites_met"]:
        command = "codex login" if client == "codex" else "claude auth login"
        raise PreflightError(f"Client login is missing or unavailable. Daniel should run {command} in his terminal, then repeat --check.")
    return launch_interactive(plan)


if __name__ == "__main__":
    try:
        sys.exit(main() or 0)
    except (PreflightError, OSError, ValueError, KeyError, TypeError):
        error = sys.exception()
        message = str(error) if isinstance(error, PreflightError) else "Configuration could not be validated (details withheld)."
        print("CARTAN: " + message, file=sys.stderr)
        sys.exit(2)
