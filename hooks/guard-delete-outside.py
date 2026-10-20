#!/usr/bin/env python3
"""TSGF Guard: guard-delete-outside.py
Blocks commands attempting deletion (rm, rmdir, find -delete, git clean)
that target paths outside the project root, or dangerous paths like '/' or '~'.
"""

import json
import os
import shlex
import sys
from pathlib import Path

DANGEROUS_EXACT = {"/", "~", "*", "/*", "~/*"}


def is_safe_target(target_path: str, root_path: Path) -> bool:
    cleaned = target_path.strip().strip("'\"")
    if not cleaned or cleaned.startswith("-"):
        return True

    if cleaned in DANGEROUS_EXACT:
        return False

    try:
        resolved = Path(cleaned).expanduser().resolve()
    except Exception:
        return False

    # Target must reside within the project root
    try:
        resolved.relative_to(root_path)
        return True
    except ValueError:
        return False


def inspect_command(cmd_str: str, root_path: Path) -> tuple[bool, str]:
    if not cmd_str:
        return True, ""

    try:
        tokens = shlex.split(cmd_str)
    except Exception:
        tokens = cmd_str.split()

    for i, token in enumerate(tokens):
        if token in ("rm", "rmdir", "unlink"):
            args = tokens[i + 1 :]
            for arg in args:
                if arg.startswith("-"):
                    continue
                if not is_safe_target(arg, root_path):
                    return False, f"Blocked: Deletion target '{arg}' is outside the repository boundary."

        elif token == "find" and "-delete" in tokens[i:]:
            # Find the path given to `find`
            args = tokens[i + 1 :]
            for arg in args:
                if arg.startswith("-"):
                    break
                if not is_safe_target(arg, root_path):
                    return False, f"Blocked: `find -delete` on target '{arg}' is outside the repository boundary."

    return True, ""


def main():
    root_path = Path.cwd().resolve()
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

    allowed, reason = inspect_command(cmd, root_path)
    if not allowed:
        sys.stderr.write(f"🛑 [tsgf-guard] {reason}\n")
        print(json.dumps({"decision": "reject", "reason": reason}))
        sys.exit(1)

    print(json.dumps({"decision": "approve"}))
    sys.exit(0)


if __name__ == "__main__":
    main()
