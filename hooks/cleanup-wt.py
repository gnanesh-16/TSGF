#!/usr/bin/env python3
"""TSGF Hook: cleanup-wt.py
Safely prunes merged git worktrees and temporary branches,
logging all actions to `.claude/tsgf/recovery.json` for safety and auditability.
"""

import json
import os
import subprocess
import sys
import time
from pathlib import Path


def run_git(args: list[str]) -> tuple[int, str]:
    try:
        res = subprocess.run(["git"] + args, capture_output=True, text=True, check=False)
        return res.returncode, res.stdout.strip()
    except Exception as e:
        return 1, str(e)


def main():
    root = Path.cwd()
    tsgf_dir = root / ".claude" / "tsgf"
    tsgf_dir.mkdir(parents=True, exist_ok=True)
    recovery_file = tsgf_dir / "recovery.json"

    # 1. Prune git worktree administrative files
    run_git(["worktree", "prune"])

    # 2. List active worktrees
    code, out = run_git(["worktree", "list", "--porcelain"])
    if code != 0:
        return

    worktrees = []
    current_wt = {}
    for line in out.splitlines():
        if line.startswith("worktree "):
            if current_wt:
                worktrees.append(current_wt)
            current_wt = {"path": line.split(" ", 1)[1]}
        elif line.startswith("branch "):
            current_wt["branch"] = line.split(" ", 1)[1]
    if current_wt:
        worktrees.append(current_wt)

    # 3. Check for worktrees under .claude/worktrees or .agents/worktrees
    cleaned = []
    for wt in worktrees:
        p = Path(wt.get("path", ""))
        try:
            rel = p.relative_to(root).as_posix()
        except ValueError:
            continue

        if rel.startswith(".claude/worktrees/") or rel.startswith(".agents/worktrees/"):
            branch = wt.get("branch", "")
            # Check if branch is merged to HEAD
            if branch:
                branch_short = branch.replace("refs/heads/", "")
                m_code, m_out = run_git(["branch", "--merged", "HEAD"])
                is_merged = branch_short in [b.strip().lstrip("* ") for b in m_out.splitlines()]
                if is_merged:
                    # Safe to remove worktree
                    run_git(["worktree", "remove", "--force", str(p)])
                    run_git(["branch", "-d", branch_short])
                    cleaned.append({
                        "path": str(p),
                        "branch": branch_short,
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    })

    if cleaned:
        recovery_data = []
        if recovery_file.exists():
            try:
                recovery_data = json.loads(recovery_file.read_text(encoding="utf-8"))
            except Exception:
                recovery_data = []
        recovery_data.extend(cleaned)
        recovery_file.write_text(json.dumps(recovery_data, indent=2), encoding="utf-8")
        print(f"🧹 [tsgf-cleanup] Pruned {len(cleaned)} merged worktree(s).")


if __name__ == "__main__":
    main()
