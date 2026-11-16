#!/usr/bin/env python3
"""Non-destructive launcher tests using temporary Git worktrees and local stubs.

Never starts Codex/Claude inference. Real client calls inspect versions,
local auth and effective MCP configuration; auth/MCP checks deny network.
"""
import contextlib
import fcntl
import importlib.util
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SOURCE = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("cartan_launch", SOURCE / "scripts/launch.py")
launch = importlib.util.module_from_spec(spec)
spec.loader.exec_module(launch)


@contextlib.contextmanager
def changed(path, content):
    old = path.read_bytes()
    path.write_bytes(content)
    try:
        yield
    finally:
        path.write_bytes(old)


class EnvironmentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory(prefix="cartan-guard-tests-")
        cls.root = (Path(cls.tmp.name) / "cartan").resolve()
        shutil.copytree(SOURCE, cls.root, ignore=shutil.ignore_patterns(".git", "__pycache__", ".cartan"))
        cls.config = json.loads((cls.root / "config/environment.json").read_text())
        cls.config["canonical_root"] = str(cls.root)
        (cls.root / "config/environment.json").write_text(json.dumps(cls.config))
        cls.root_patch = patch.object(launch, "ROOT", cls.root)
        cls.root_patch.start()
        cls.git(cls.root, "init", "--initial-branch=setup/environment")
        cls.git(cls.root, "add", ".")
        cls.git(cls.root, "commit", "-m", "Prepare temporary CARTAN guard fixture")
        for lane, entry in cls.config["lanes"].items():
            target = (cls.root / entry["path"]).resolve()
            cls.git(cls.root, "worktree", "add", "-b", entry["branch"], str(target))
        cls.research = (cls.root / cls.config["lanes"]["research"]["path"]).resolve()
        cls.ui = (cls.root / cls.config["lanes"]["ui"]["path"]).resolve()

    @classmethod
    def tearDownClass(cls):
        cls.root_patch.stop()
        cls.tmp.cleanup()

    @staticmethod
    def git(root, *args):
        r = subprocess.run(["/usr/bin/git", "-C", str(root), *args],
                           env=launch.child_env(), capture_output=True, timeout=15)
        if r.returncode:
            raise RuntimeError("Temporary fixture Git command failed (diagnostic withheld)")

    def setUp(self):
        # A positive control before every mutation prevents a broken fixture from
        # making all rejection tests pass for the wrong reason.
        launch.validate_identity(self.root, self.config, "research")

    def test_all_client_lane_plans(self):
        for client in ("codex", "claude"):
            for lane in ("research", "ui"):
                with self.subTest(client=client, lane=lane):
                    plan = launch.make_plan(client, lane, self.root)
                    self.assertEqual(plan["cwd"], str(getattr(self, lane)))
                    self.assertIn("CARTAN-01" if lane == "research" else "CARTAN-02", plan["prompt_file"])
                    self.assertFalse(plan["model_started"])
                    self.assertFalse(any("dangerously" in arg or "bypassPermissions" in arg for arg in plan["argv"]))

    def test_default_and_aliases(self):
        for name, client in launch.CLIENT_NAMES.items():
            self.assertEqual(launch.parse_args(name, []), (client, "research", False, "start"))
            self.assertEqual(launch.parse_args(name, ["ui", "--check"]), (client, "ui", True, "start"))
            self.assertEqual(launch.parse_args(name, ["resume"]), (client, "research", False, "resume"))
            self.assertEqual(launch.parse_args(name, ["ui", "resume", "--check"]), (client, "ui", True, "resume"))

    def test_resume_plans_keep_scope_without_injecting_a_new_task(self):
        for client in ("codex", "claude"):
            for lane in ("research", "ui"):
                with self.subTest(client=client, lane=lane):
                    plan = launch.make_plan(client, lane, self.root, action="resume")
                    argv = plan["argv"]
                    self.assertEqual(plan["cwd"], str(getattr(self, lane)))
                    self.assertEqual(plan["action"], "resume")
                    self.assertFalse(any("CARTAN-01" in arg or "CARTAN-02" in arg for arg in argv))
                    self.assertFalse(any(arg in ("--last", "--all", "--continue") for arg in argv))
                    if client == "codex":
                        self.assertEqual(argv[1], "resume")
                        self.assertEqual(argv[argv.index("-C") + 1], plan["cwd"])
                        self.assertEqual(argv[argv.index("--sandbox") + 1], "workspace-write")
                        self.assertEqual(argv[argv.index("--ask-for-approval") + 1], "on-request")
                    else:
                        self.assertEqual(argv[-1], "--resume")
                        self.assertEqual(argv[argv.index("--permission-mode") + 1], "manual")
                        self.assertIn("--strict-mcp-config", argv)

    def test_start_reads_current_canonical_setup_without_changing_lane(self):
        before = (self.research / "docs/SESSION_HANDOFF.md").read_bytes()
        plan = launch.make_plan("codex", "research", self.root)
        for path in plan["current_setup_context"]:
            self.assertIn(path, plan["argv"][-1])
        self.assertEqual((self.research / "docs/SESSION_HANDOFF.md").read_bytes(), before)

    def test_missing_current_setup_context_fails(self):
        path = self.root / "docs/SESSION-OPERATIONS.md"
        content = path.read_bytes()
        path.unlink()
        try:
            with self.assertRaises(launch.PreflightError):
                launch.make_plan("codex", "research", self.root)
        finally:
            path.write_bytes(content)

    def test_claude_reports_only_its_configured_mcp(self):
        plan = launch.make_plan("claude", "research", self.root)
        self.assertEqual(plan["configured_mcp_allowlist"], ["openaiDeveloperDocs"])

    def test_native_inspection_never_invokes_resume_or_an_initial_prompt(self):
        base = ["codex", "--strict-config", "-C", str(self.research)]
        servers = [{"name": n, "enabled": True} for n in ("cua_repl", "node_repl", "openaiDeveloperDocs")]
        with patch.object(launch, "run", return_value=json.dumps(servers)) as run:
            launch.validate_native_codex(base, self.research)
        invoked = run.call_args.args[0]
        self.assertEqual(invoked[-5:], ["-C", str(self.research), "mcp", "list", "--json"])
        self.assertNotIn("--strict-config", invoked)
        self.assertNotIn("resume", invoked)

    def test_unknown_flags_and_secret_arguments_not_echoed(self):
        for args in [["--dangerously-skip-permissions"], ["--config", "SECRET_CANARY"],
                     ["--workspace", "/tmp/foreign"], ["ui", "research"], ["--check", "--check"],
                     ["resume", "resume"], ["resume", "SECRET_CANARY"], ["resume", "--all"]]:
            with self.assertRaises(launch.PreflightError) as error:
                launch.parse_args("cartancodes", args)
            self.assertNotIn("SECRET_CANARY", str(error.exception))

    def test_environment_filters_credentials_and_git_injection(self):
        env = launch.child_env({"HOME": "/safe", "PATH": "/bin", "TERM": "xterm",
            "OPENAI_API_KEY": "SECRET_CANARY", "ANTHROPIC_API_KEY": "SECRET_CANARY",
            "AWS_SECRET_ACCESS_KEY": "SECRET_CANARY", "GIT_DIR": "/wrong",
            "NODE_OPTIONS": "--require=wrong", "BASH_ENV": "/wrong",
            "HTTPS_PROXY": "https://configured-proxy.invalid"})
        self.assertEqual(env["HOME"], "/safe")
        self.assertIn("HTTPS_PROXY", env)
        self.assertNotIn("SECRET_CANARY", json.dumps(env))
        self.assertTrue(all(k not in env for k in ("GIT_DIR", "NODE_OPTIONS", "BASH_ENV")))

    def test_injected_git_environment_does_not_retarget_checks(self):
        with patch.dict(os.environ, {"GIT_DIR": "/nonexistent/secret", "GIT_WORK_TREE": "/tmp"}):
            root, _ = launch.validate_identity(self.root, self.config, "research")
            self.assertEqual(root, self.research)

    def test_missing_instructions_fail(self):
        path = self.research / "AGENTS.md"
        original = path.read_bytes()
        path.unlink()
        try:
            with self.assertRaises(launch.PreflightError):
                launch.validate_identity(self.root, self.config, "research")
        finally:
            path.write_bytes(original)

    def test_instruction_symlink_rejected(self):
        path = self.research / "AGENTS.md"
        original = path.read_bytes()
        path.unlink()
        path.symlink_to(self.root / "AGENTS.md")
        try:
            with self.assertRaises(launch.PreflightError):
                launch.validate_identity(self.root, self.config, "research")
        finally:
            path.unlink()
            path.write_bytes(original)

    def test_config_drift_rejected(self):
        path = self.research / ".codex/config.toml"
        with changed(path, path.read_bytes() + b"\n# unexpected lane change\n"):
            with self.assertRaises(launch.PreflightError):
                launch.validate_identity(self.root, self.config, "research")

    def test_detached_branch_rejected(self):
        self.git(self.research, "checkout", "--detach")
        try:
            with self.assertRaises(launch.PreflightError):
                launch.validate_identity(self.root, self.config, "research")
        finally:
            self.git(self.research, "checkout", "research/architecture")

    def test_unexpected_remote_rejected_without_url_leak(self):
        self.git(self.root, "remote", "add", "unexpected", "https://SECRET_CANARY@example.invalid/repo")
        try:
            with self.assertRaises(launch.PreflightError) as error:
                launch.validate_identity(self.root, self.config, "research")
            self.assertNotIn("SECRET_CANARY", str(error.exception))
        finally:
            self.git(self.root, "remote", "remove", "unexpected")

    def test_foreign_worktree_rejected(self):
        foreign = Path(self.tmp.name) / "foreign"
        foreign.mkdir()
        self.git(foreign, "init")
        config = json.loads(json.dumps(self.config))
        config["lanes"]["research"]["path"] = str(foreign)
        with self.assertRaises(launch.PreflightError):
            launch.validate_identity(self.root, config, "research")

    def test_missing_input_rejected(self):
        path = self.root / "config/inputs.json"
        data = json.loads(path.read_text())
        data["root"] = "/nonexistent/cartan-inputs"
        with changed(path, json.dumps(data).encode()):
            with self.assertRaises(launch.PreflightError):
                launch.validate_inputs(self.root)

    def test_changed_input_hash_rejected_without_touching_original(self):
        path = self.root / "config/inputs.json"
        data = json.loads(path.read_text())
        data["files"][0]["sha256"] = "0" * 64
        with changed(path, json.dumps(data).encode()):
            with self.assertRaises(launch.PreflightError):
                launch.validate_inputs(self.root)

    def test_corrupt_json_rejected_without_content_leak(self):
        path = self.root / "config/environment.json"
        with changed(path, b"SECRET_CANARY not JSON"):
            with self.assertRaises(launch.PreflightError) as error:
                launch.load_json(path)
            self.assertNotIn("SECRET_CANARY", str(error.exception))

    def test_security_policy_drift_rejected(self):
        path = self.root / ".codex/config.toml"
        with changed(path, path.read_bytes().replace(b'"on-request"', b'"never"')):
            with self.assertRaises(launch.PreflightError):
                launch.validate_settings(self.root)

    def test_dry_run_never_enters_launch_path(self):
        out = io.StringIO()
        with patch.object(sys, "argv", ["cartancodes", "--check"]), \
             patch.object(launch, "make_plan", return_value={"model_started": False}), \
             patch.object(launch, "launch_interactive", side_effect=AssertionError("launch forbidden")), \
             contextlib.redirect_stdout(out):
            launch.main()
        self.assertFalse(json.loads(out.getvalue())["model_started"])

    def test_nested_launch_refused(self):
        with patch.dict(os.environ, {"CODEX_THREAD_ID": "test"}):
            with self.assertRaises(launch.PreflightError):
                launch.launch_interactive({})

    def test_noninteractive_launch_refused(self):
        with patch.dict(os.environ, {}, clear=True), patch.object(sys.stdin, "isatty", return_value=False):
            with self.assertRaises(launch.PreflightError):
                launch.launch_interactive({})

    def test_existing_lane_lock_does_not_block_another_terminal(self):
        runtime = self.research / ".cartan"
        runtime.mkdir(exist_ok=True)
        with (runtime / "launch.lock").open("w") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            plan = {"cwd": str(self.research), "lane": "research", "client": "local-probe",
                    "argv": ["/usr/bin/true"]}
            with patch.dict(os.environ, {}, clear=True), \
                 contextlib.redirect_stdout(io.StringIO()), \
                 patch.object(sys.stdin, "isatty", return_value=True), \
                 patch.object(sys.stdout, "isatty", return_value=True):
                self.assertEqual(launch.launch_interactive(plan), 0)
                self.assertEqual(launch.launch_interactive(plan), 0)

    def test_foreground_supervisor_uses_selected_cwd(self):
        # Exercise the real foreground boundary with a harmless local Python
        # process, not a model client. Only a temporary fixture gets a file.
        program = ("import json,os; from pathlib import Path; "
                   "Path('probe.json').write_text(json.dumps({"
                   "'cwd':str(Path.cwd()),'key_present':'OPENAI_API_KEY' in os.environ}))")
        plan = {"cwd": str(self.ui), "lane": "ui", "client": "local-probe",
                "argv": [sys.executable, "-c", program]}
        with patch.dict(os.environ, {"OPENAI_API_KEY": "SECRET_CANARY"}, clear=True), \
             contextlib.redirect_stdout(io.StringIO()), \
             patch.object(sys.stdin, "isatty", return_value=True), \
             patch.object(sys.stdout, "isatty", return_value=True):
            self.assertEqual(launch.launch_interactive(plan), 0)
        result = json.loads((self.ui / "probe.json").read_text())
        self.assertEqual(result, {"cwd": str(self.ui), "key_present": False})

    def test_canonical_launcher_does_not_require_rewriting_active_lane_copy(self):
        path = self.research / "scripts/launch.py"
        with changed(path, b"# Older branch-local snapshot; installed commands use the canonical script.\n"):
            launch.validate_identity(self.root, self.config, "research")

    def test_installer_refuses_collision_without_overwrite(self):
        spec = importlib.util.spec_from_file_location("cartan_install", SOURCE / "scripts/install_launchers.py")
        installer = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(installer)
        fake_home = Path(self.tmp.name) / "installer-home"
        directory = fake_home / ".local/bin"
        directory.mkdir(parents=True)
        existing = directory / "cartancodes"
        existing.write_text("preserve original")
        with patch.object(installer, "ROOT", self.root), patch.object(Path, "home", return_value=fake_home), \
             patch.object(sys, "argv", ["install_launchers.py"]):
            with self.assertRaises(SystemExit):
                installer.main()
        self.assertEqual(existing.read_text(), "preserve original")
        self.assertFalse((directory / "cartan-codex").exists())

    def test_missing_client_fails(self):
        path = self.root / "config/environment.json"
        data = json.loads(path.read_text())
        data["clients"]["codex"]["path"] = "/nonexistent/client"
        content = json.dumps(data).encode()
        with changed(path, content), changed(self.research / "config/environment.json", content):
            with self.assertRaises(launch.PreflightError):
                launch.make_plan("codex", "research", self.root)

    def test_version_drift_fails(self):
        path = self.root / "config/environment.json"
        data = json.loads(path.read_text())
        data["clients"]["codex"]["version"] = "unreviewed-version"
        content = json.dumps(data).encode()
        with changed(path, content), changed(self.research / "config/environment.json", content):
            with self.assertRaises(launch.PreflightError):
                launch.make_plan("codex", "research", self.root)

    def test_dirty_work_is_preserved(self):
        path = self.research / "pending-note.txt"
        path.write_text("preserve this work")
        try:
            self.assertEqual(launch.make_plan("codex", "research", self.root)["worktree_state"], "dirty (preserved)")
            self.assertEqual(path.read_text(), "preserve this work")
        finally:
            path.unlink()


if __name__ == "__main__":
    unittest.main(verbosity=2)
