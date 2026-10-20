#!/usr/bin/env python3
"""TSGF Guard: guard-secrets.py
Blocks commands that attempt to read, cat, dump, or pipe secret credential files,
such as .env files, private SSH keys, and cloud credentials.
"""

import json
import re
import shlex
import sys

SENSITIVE_PATTERNS = [
    r"(^|/)\.env(\.(local|prod|production|staging|dev|development))?$",
    r"(^|/)id_(rsa|dsa|ecdsa|ed25519)(\.pub)?$",
    r"\.pem$",
    r"\.key$",
    r"\.pfx$",
    r"\.p12$",
    r"(^|/)service[-_]account.*\.json$",
    r"(^|/)\.aws/(credentials|config)$",
    r"(^|/)\.netrc$",
]

EXEMPT_PATTERNS = [
    r"\.env\.example$",
    r"\.env\.sample$",
    r"\.env\.template$",
]

READ_COMMANDS = {
    "cat", "less", "more", "head", "tail", "view", "vim", "vi", "nano",
    "grep", "rg", "ag", "awk", "sed", "python", "python3", "node", "ruby", "perl",
    "source", ".", "sh", "bash", "zsh", "cp", "mv"
}


def is_sensitive_path(path: str) -> bool:
    clean = path.strip().strip("'\"")
    for ex in EXEMPT_PATTERNS:
        if re.search(ex, clean, re.IGNORECASE):
            return False
    for pat in SENSITIVE_PATTERNS:
        if re.search(pat, clean, re.IGNORECASE):
            return True
    return False


def inspect_command(cmd_str: str) -> tuple[bool, str]:
    if not cmd_str:
        return True, ""

    # Quick check for .env or key references before tokenizing
    if not any(k in cmd_str for k in (".env", "id_", ".pem", ".key", "credentials", "service_account")):
        return True, ""

    try:
        tokens = shlex.split(cmd_str)
    except Exception:
        tokens = cmd_str.split()

    for token in tokens:
        # Check redirects or file targets
        cleaned = token.lstrip("<>|&;")
        if is_sensitive_path(cleaned):
            return False, f"Blocked: Access to sensitive credential file is restricted ('{cleaned}')."

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
