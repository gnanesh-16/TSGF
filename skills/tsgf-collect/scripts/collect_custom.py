#!/usr/bin/env python3
"""
TSGF Signal Collection: collect_custom.py
Polls custom user commands, local shell linters, or custom REST webhooks.
"""
import sys
import json
import subprocess
from collect_common import compute_fingerprint, format_ticket_body

def run_custom_source(command_str: str):
    if not command_str:
        return []
    try:
        proc = subprocess.run(command_str, shell=True, capture_output=True, text=True, timeout=30)
        if proc.stdout.strip():
            return [{
                "id": "custom-cmd",
                "title": "[bug] Custom collector finding",
                "fingerprint": compute_fingerprint("custom", "cli", command_str[:30]),
                "body": format_ticket_body(
                    title="Custom collector finding",
                    problem=proc.stdout[:200],
                    context=f"Command: {command_str}",
                    solution="Investigate custom command output",
                    ac_list=["Command passes with exit code 0"]
                )
            }]
    except Exception as e:
        sys.stderr.write(f"Custom collector execution error: {e}\n")
    return []

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    findings = run_custom_source(cmd)
    print(json.dumps(findings, indent=2))
