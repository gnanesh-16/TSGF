#!/usr/bin/env python3
"""TSGF Guard: guard-key-literals.py
Detects live or high-entropy API key literals in code writes, edits,
and command lines to prevent secret leakage into source control.
"""

import json
import re
import sys

KEY_PATTERNS = [
    (r"\b(ghp_[a-zA-Z0-9]{36})\b", "GitHub Personal Access Token"),
    (r"\b(github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59})\b", "Fine-grained GitHub Token"),
    (r"\b(sk-[a-zA-Z0-9]{48})\b", "OpenAI Secret Key"),
    (r"\b(sk-ant-[a-zA-Z0-9_-]{32,})\b", "Anthropic API Key"),
    (r"\b(AIzaSy[a-zA-Z0-9_-]{33})\b", "Google API Key"),
    (r"\b(AKIA[0-9A-Z]{16})\b", "AWS Access Key ID"),
    (r"\b(xox[baprs]-[0-9a-zA-Z]{10,48})\b", "Slack Token"),
    (r"\b(sk_live_[0-9a-zA-Z]{24,})\b", "Stripe Live Secret Key"),
    (r"\b(sq0atp-[0-9A-Za-z\-_]{22})\b", "Square Access Token"),
]

PLACEHOLDER_REGEX = re.compile(
    r"(your[-_]?api[-_]?key|example|dummy|fake|placeholder|test[-_]?key|changeme|xxxx)",
    re.IGNORECASE,
)


def inspect_text(content: str) -> tuple[bool, str]:
    if not content:
        return True, ""

    for pattern, name in KEY_PATTERNS:
        matches = re.finditer(pattern, content)
        for match in matches:
            val = match.group(0)
            if not PLACEHOLDER_REGEX.search(val):
                redacted = val[:6] + "..." + val[-4:] if len(val) > 10 else "***"
                return False, f"Blocked: Detected unredacted {name} ({redacted}) in input."

    return True, ""


def main():
    raw_input = ""
    if not sys.stdin.isatty():
        raw_input = sys.stdin.read().strip()

    text_to_check = ""
    if raw_input:
        try:
            data = json.loads(raw_input)
            if isinstance(data, dict):
                tool_input = data.get("tool_input", {})
                if isinstance(tool_input, dict):
                    text_to_check = (
                        tool_input.get("content")
                        or tool_input.get("code")
                        or tool_input.get("command")
                        or tool_input.get("CommandLine")
                        or tool_input.get("ReplacementContent")
                        or tool_input.get("CodeContent")
                        or ""
                    )
                else:
                    text_to_check = str(tool_input)
        except Exception:
            text_to_check = raw_input
    elif len(sys.argv) > 1:
        text_to_check = " ".join(sys.argv[1:])

    allowed, reason = inspect_text(text_to_check)
    if not allowed:
        sys.stderr.write(f"🛑 [tsgf-guard] {reason}\n")
        print(json.dumps({"decision": "reject", "reason": reason}))
        sys.exit(1)

    print(json.dumps({"decision": "approve"}))
    sys.exit(0)


if __name__ == "__main__":
    main()
