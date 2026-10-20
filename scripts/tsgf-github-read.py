#!/usr/bin/env python3
"""TSGF: tsgf-github-read.py
Robust GitHub API reader for issues, PRs, project boards, and rate-limits.
Exit codes:
0: Success (JSON output on stdout)
1: Generic error
79: GitHub rate limit or authentication exhausted
"""

import argparse
import json
import os
import subprocess
import sys


def run_gh(cmd_args: list[str]) -> tuple[int, str, str]:
    env = os.environ.copy()
    try:
        proc = subprocess.run(
            ["gh"] + cmd_args,
            capture_output=True,
            text=True,
            check=False,
            env=env,
        )
        return proc.returncode, proc.stdout.strip(), proc.stderr.strip()
    except FileNotFoundError:
        return 1, "", "gh CLI not found on PATH"


def check_rate_limit():
    code, out, err = run_gh(["api", "rate_limit"])
    if code != 0:
        return True, 5000, 5000
    try:
        data = json.loads(out)
        graphql = data.get("resources", {}).get("graphql", {}).get("remaining", 5000)
        rest = data.get("resources", {}).get("core", {}).get("remaining", 5000)
        if graphql < 50 or rest < 50:
            return False, graphql, rest
        return True, graphql, rest
    except Exception:
        return True, 5000, 5000


def get_issue(issue_num: int):
    code, out, err = run_gh(["issue", "view", str(issue_num), "--json", "number,title,body,labels,state,assignees,comments"])
    if code != 0:
        sys.stderr.write(f"Failed to view issue #{issue_num}: {err}\n")
        sys.exit(code)
    print(out)


def get_pr(pr_num: int):
    code, out, err = run_gh([
        "pr", "view", str(pr_num),
        "--json", "number,title,body,state,isDraft,mergeable,reviews,statusCheckRollup,headRefName,baseRefName,commits"
    ])
    if code != 0:
        sys.stderr.write(f"Failed to view PR #{pr_num}: {err}\n")
        sys.exit(code)
    print(out)


def main():
    parser = argparse.ArgumentParser(description="TSGF GitHub Reader")
    parser.add_argument("--check-quota", action="store_true", help="Check remaining rate limits")
    parser.add_argument("--issue", type=int, help="Fetch issue details by number")
    parser.add_argument("--pr", type=int, help="Fetch PR details by number")
    args = parser.parse_args()

    ok, gql, rest = check_rate_limit()
    if not ok:
        sys.stderr.write(f"🛑 [tsgf-github-read] Exhausted GitHub API rate limit (GraphQL: {gql}, REST: {rest})\n")
        sys.exit(79)

    if args.check_quota:
        print(json.dumps({"graphql_remaining": gql, "rest_remaining": rest}))
        sys.exit(0)

    if args.issue:
        get_issue(args.issue)
    elif args.pr:
        get_pr(args.pr)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
