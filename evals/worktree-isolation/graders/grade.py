#!/usr/bin/env python3
"""
Grader for worktree-isolation evaluation.
Asserts that guard-worktree-path blocks invalid directories and permits .claude/worktrees/.
"""
import sys
import subprocess
import json

def test_worktree_guard():
    repo_root = "/Users/gnaneshb/Developer/TSGF"
    guard_script = f"{repo_root}/hooks/guard-worktree-path.py"

    # Test 1: Escape target outside worktrees -> Must block (returncode != 0)
    proc_bad = subprocess.run(
        [sys.executable, guard_script],
        input=json.dumps({"command": "git worktree add ../escaping-worktree"}),
        text=True,
        capture_output=True
    )
    assert proc_bad.returncode != 0, f"Expected escape to be blocked, but returned 0! Output: {proc_bad.stderr}"

    # Test 2: Valid target inside .claude/worktrees/ -> Must allow (returncode == 0)
    proc_good = subprocess.run(
        [sys.executable, guard_script],
        input=json.dumps({"command": "git worktree add .claude/worktrees/issue-101"}),
        text=True,
        capture_output=True
    )
    assert proc_good.returncode == 0, f"Expected valid worktree to be allowed, but returned {proc_good.returncode}!"

    # Test 3: Valid target inside .agents/worktrees/ -> Must allow
    proc_agents = subprocess.run(
        [sys.executable, guard_script],
        input=json.dumps({"command": "git worktree add .agents/worktrees/issue-102"}),
        text=True,
        capture_output=True
    )
    assert proc_agents.returncode == 0, "Expected .agents/worktrees/ to be allowed"

    print("PASS: worktree-isolation successfully enforced sandbox boundaries.")
    return True

if __name__ == "__main__":
    try:
        test_worktree_guard()
        sys.exit(0)
    except AssertionError as e:
        print(f"FAIL: {e}")
        sys.exit(1)
