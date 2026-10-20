#!/usr/bin/env python3
"""TSGF Guard: guard-protected-push.py
Blocks direct or force pushes to protected branches (main, master, production, release).
All changes in TSGF must pass through pull requests and the automated merge gate.
"""

import json
import re
import shlex
import sys

PROTECTED_BRANCHES = {"main", "master", "prod", "production", "release"}


def inspect_command(cmd_str: str) -> tuple[bool, str]:
    if not cmd_str or "push" not in cmd_str:
        return True, ""

    try:
        tokens = shlex.split(cmd_str)
    except Exception:
        tokens = cmd_str.split()

    for i in range(len(tokens) - 1):
        if tokens[i] == "git" and tokens[i + 1] == "push":
            args = tokens[i + 2 :]
            has_force = any(a in ("--force", "-f", "--force-with-lease") for a in args)

            target_branch = ""
            for a in args:
                if a.startswith("-"):
                    continue
                # origin <branch> or <remote> <refspec>
                if ":" in a:
                    target_branch = a.split(":")[-1]
                else:
                    target_branch = a

            if target_branch in PROTECTED_BRANCHES:
                return False, (
                    f"Blocked: Direct push to protected branch '{target_branch}' is forbidden. "
                    "Push to a feature branch and submit a PR through TSGF."
                )

            if has_force and (not target_branch or target_branch in PROTECTED_BRANCHES):
                return False, "Blocked: Force-pushing to base branches is strictly prohibited."

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
