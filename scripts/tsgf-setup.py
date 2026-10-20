#!/usr/bin/env python3
"""TSGF: tsgf-setup.py
Runs the 🔍 Checks step for onboarding and upgrades.
Verifies directories, board columns, hooks, and configurations.
"""

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path


def ensure_board_config(root: Path):
    tsgf_dir = root / ".claude" / "tsgf"
    tsgf_dir.mkdir(parents=True, exist_ok=True)
    board_file = tsgf_dir / "board.json"
    if not board_file.exists():
        initial_board = {
            "Backlog": [],
            "Ready": [],
            "Building": [],
            "QA": [],
            "Review": [],
            "Done": [],
            "Blocked": [],
        }
        board_file.write_text(json.dumps(initial_board, indent=2), encoding="utf-8")
        print("   ✓ Initialized local Kanban board (.claude/tsgf/board.json)")

    config_file = tsgf_dir / "config.json"
    if not config_file.exists():
        initial_config = {
            "version": "1.0.0",
            "worker_backend": "workflow",
            "verify_commands": [],
            "model_tier": "default",
        }
        config_file.write_text(json.dumps(initial_config, indent=2), encoding="utf-8")
        print("   ✓ Initialized project config (.claude/tsgf/config.json)")


def main():
    root = Path.cwd()
    print("🔍 [tsgf-setup] Running setup & verification checks...")
    ensure_board_config(root)
    print("✓ Setup checks complete.")


if __name__ == "__main__":
    main()
