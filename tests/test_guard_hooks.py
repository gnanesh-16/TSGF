#!/usr/bin/env python3
"""TSGF Test Suite: test_guard_hooks.py
Unit tests for all deterministic guard hooks.
"""

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOOKS = ROOT / "hooks"


def run_hook(hook_name: str, cmd_input: str) -> tuple[int, dict]:
    payload = json.dumps({"tool_name": "run_command", "tool_input": {"command": cmd_input}})
    proc = subprocess.run(
        [sys.executable, str(HOOKS / hook_name)],
        input=payload,
        capture_output=True,
        text=True,
        check=False,
    )
    res = {}
    try:
        res = json.loads(proc.stdout)
    except Exception:
        pass
    return proc.returncode, res


def test_worktree_guard():
    # Allowed
    code, res = run_hook("guard-worktree-path.py", "git worktree add .claude/worktrees/101 -b tsgf/101-feat")
    assert code == 0, f"Expected 0, got {code}"
    assert res.get("decision") == "approve"

    # Blocked
    code, res = run_hook("guard-worktree-path.py", "git worktree add /tmp/bad-wt -b bad-feat")
    assert code == 1, f"Expected 1, got {code}"
    assert res.get("decision") == "reject"
    print("✓ guard-worktree-path passed")


def test_secrets_guard():
    # Blocked
    code, res = run_hook("guard-secrets.py", "cat .env")
    assert code == 1
    assert res.get("decision") == "reject"

    code, res = run_hook("guard-secrets.py", "grep API_KEY ~/.ssh/id_rsa")
    assert code == 1

    # Allowed
    code, res = run_hook("guard-secrets.py", "cat .env.example")
    assert code == 0
    print("✓ guard-secrets passed")


def test_key_literals_guard():
    # Blocked live key
    code, res = run_hook("guard-key-literals.py", "export GITHUB_TOKEN=ghp_111111111111111111111111111111111111")
    assert code == 1
    assert res.get("decision") == "reject"

    # Allowed placeholder
    code, res = run_hook("guard-key-literals.py", "export GITHUB_TOKEN=your_placeholder_token")
    assert code == 0
    print("✓ guard-key-literals passed")


def test_delete_outside_guard():
    # Blocked
    code, res = run_hook("guard-delete-outside.py", "rm -rf /")
    assert code == 1

    code, res = run_hook("guard-delete-outside.py", "rm -rf ~")
    assert code == 1

    # Allowed local
    code, res = run_hook("guard-delete-outside.py", "rm -rf scratch/temp.txt")
    assert code == 0
    print("✓ guard-delete-outside passed")


def test_protected_push_guard():
    # Blocked
    code, res = run_hook("guard-protected-push.py", "git push origin main")
    assert code == 1

    code, res = run_hook("guard-protected-push.py", "git push -f origin master")
    assert code == 1

    # Allowed feature push
    code, res = run_hook("guard-protected-push.py", "git push origin tsgf/101-feat")
    assert code == 0
    print("✓ guard-protected-push passed")


def main():
    print("🧪 Running TSGF Guard Hook Tests...")
    test_worktree_guard()
    test_secrets_guard()
    test_key_literals_guard()
    test_delete_outside_guard()
    test_protected_push_guard()
    print("🎉 All guard tests passed!")


if __name__ == "__main__":
    main()
