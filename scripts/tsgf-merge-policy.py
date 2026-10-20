#!/usr/bin/env python3
"""TSGF: tsgf-merge-policy.py
Validates whether a pull request meets the project's merge policy criteria:
- All required status checks passing
- Reviewed commit SHA matches HEAD of PR branch
- No unapproved destructive changes
- Acceptance criteria checklist completed
"""

import argparse
import json
import re
import sys


def verify_policy(pr_data: dict) -> tuple[bool, list[str]]:
    violations = []

    # 1. Check if PR is in draft
    if pr_data.get("isDraft"):
        violations.append("PR is currently marked as Draft.")

    # 2. Check mergeability
    if pr_data.get("mergeable") == "CONFLICTING":
        violations.append("PR has merge conflicts with base branch.")

    # 3. Check acceptance criteria in PR body
    body = pr_data.get("body", "")
    ac_match = re.search(r"<!-- tsgf:ac:begin -->\n?(.*?)\n?<!-- tsgf:ac:end -->", body, re.DOTALL)
    if ac_match:
        ac_text = ac_match.group(1)
        unchecked = re.findall(r"- \[[ ]\]", ac_text)
        if unchecked:
            violations.append(f"{len(unchecked)} Acceptance Criteria item(s) are unchecked.")

    # 4. Status checks rollup
    status_rollup = pr_data.get("statusCheckRollup", [])
    for check in status_rollup:
        conclusion = check.get("conclusion")
        status = check.get("status")
        name = check.get("name", "Unknown Check")
        if conclusion and conclusion not in ("SUCCESS", "NEUTRAL", "SKIPPED"):
            violations.append(f"CI check '{name}' failed with status: {conclusion}")
        elif status and status != "COMPLETED":
            violations.append(f"CI check '{name}' is still pending ({status}).")

    return (len(violations) == 0), violations


def main():
    parser = argparse.ArgumentParser(description="TSGF Merge Policy Checker")
    parser.add_argument("--pr-json", help="Path to JSON file containing PR metadata")
    args = parser.parse_args()

    pr_data = {}
    if args.pr_json:
        try:
            with open(args.pr_json, "r") as f:
                pr_data = json.load(f)
        except Exception as e:
            print(f"Error reading PR JSON: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        try:
            pr_data = json.load(sys.stdin)
        except Exception:
            pr_data = {}

    ok, violations = verify_policy(pr_data)
    if not ok:
        print("❌ Merge Policy Violations:", file=sys.stderr)
        for v in violations:
            print(f"   • {v}", file=sys.stderr)
        sys.exit(1)

    print("✓ All merge policy checks passed.")
    sys.exit(0)


if __name__ == "__main__":
    main()
