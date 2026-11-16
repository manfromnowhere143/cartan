#!/usr/bin/env python3
"""Install only new CARTAN symlinks. Never edit shell startup or replace a file."""
import os
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
NAMES = ("cartan-codex", "cartancodes", "cartan-claude", "cartanclaudes")


def main():
    if sys.argv[1:] not in ([], ["--check"]):
        raise SystemExit("Use install_launchers.py [--check]")
    target = ROOT / "scripts/launch.py"
    directory = Path.home() / ".local/bin"
    if not directory.is_dir() or not os.access(target, os.X_OK):
        raise SystemExit("Existing ~/.local/bin and executable launch.py are required.")
    paths = [directory / name for name in NAMES]
    for p in paths:
        if os.path.lexists(p) and (not p.is_symlink() or p.resolve() != target):
            raise SystemExit("CARTAN command name collision; nothing overwritten.")
    if sys.argv[1:] == ["--check"]:
        if any(not p.is_symlink() or p.resolve() != target for p in paths):
            raise SystemExit("One or more CARTAN launchers are not installed.")
        print("All four CARTAN names resolve to the canonical launch.py.")
        return
    for p in paths:
        if not p.is_symlink():
            p.symlink_to(target)
    print("Installed CARTAN command symlinks. No shell startup files changed.")


if __name__ == "__main__":
    main()
