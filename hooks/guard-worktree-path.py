#!/usr/bin/env python3
"""TSGF Guard: guard-worktree-path.py
Enforces that `git worktree add` commands only place worktrees inside
`.claude/worktrees/` or `.agents/worktrees/` to prevent repository clutter
and inadvertent file leakage.

Supports both:
1. JSON hook protocol via stdin (tool_name: "run_command", tool_input: {"command": ...})
2. Direct command arguments via sys.argv
"""

import json
import re
import shlex
import sys
from pathlib import Path

ALLOWED_PREFIXES = (
    ".claude/worktrees/",
    ".agents/worktrees/",
)


def inspect_command(cmd_str: str) -> tuple[bool, str]:
    if not cmd_str or "worktree" not in cmd_str:
        return True, ""

    try:
        tokens = shlex.split(cmd_str)
    except Exception:
        tokens = cmd_str.split()

    for i in range(len(tokens) - 2):
        if tokens[i] == "git" and tokens[i + 1] == "worktree" and tokens[i + 2] == "add":
            # Find the path argument
            # git worktree add [-b <new-branch>] [-f] [--detach] <path> [<commit-ish>]
            args = tokens[i + 3 :]
            path_arg = None
            skip_next = False
            for arg in args:
                if skip_next:
                    skip_next = False
                    continue
                if arg in ("-b", "-B"):
                    skip_next = True
                    continue
                if arg.startswith("-"):
                    continue
                path_arg = arg
                break

            if path_arg:
                norm = Path(path_arg).as_posix().lstrip("./")
                is_allowed = any(norm.startswith(p.lstrip("./")) for p in ALLOWED_PREFIXES)
                if not is_allowed:
                    return False, (
                        f"Blocked: `git worktree add` must target one of: "
                        f"{', '.join(ALLOWED_PREFIXES)}. Target requested: '{path_arg}'"
                    )

    return True, ""


def main():
    raw_input = ""
    if not sys.stdin.isatty():
        raw_input = sys.stdin.read().strip()

    cmd = ""
    if raw_input:
        try:
            data = json.loads(raw_input)
            if isinstance(data, dict):
                tool_input = data.get("tool_input", {})
                if isinstance(tool_input, dict):
                    cmd = tool_input.get("command") or tool_input.get("CommandLine") or ""
                elif isinstance(tool_input, str):
                    cmd = tool_input
        except Exception:
            cmd = raw_input
    elif len(sys.argv) > 1:
        cmd = " ".join(sys.argv[1:])

    allowed, reason = inspect_command(cmd)
    if not allowed:
        sys.stderr.write(f"🛑 [tsgf-guard] {reason}\n")
        print(json.dumps({"decision": "reject", "reason": reason}))
        sys.exit(1)

    print(json.dumps({"decision": "approve"}))
    sys.exit(0)


if __name__ == "__main__":
    main()
