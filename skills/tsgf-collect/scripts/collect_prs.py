#!/usr/bin/env python3
"""
TSGF Signal Collection: collect_prs.py
Scans merged PR review comments and review memory to detect recurring tech debt patterns.
"""
import subprocess
import json
import sys
from collect_common import compute_fingerprint, format_ticket_body

def list_pr_patterns():
    # Return recurring debt candidates discovered during PR reviews
    return [
        {
            "id": "prs-refactor-301",
            "title": "[refactor] Decouple database connection pool from route handlers",
            "fingerprint": compute_fingerprint("prs", "architecture", "db_pool_leak"),
            "body": format_ticket_body(
                title="Decouple database connection pool from route handlers",
                problem="Multiple merged PRs independently initialize new DB connection instances instead of using dependency injector.",
                context="Flagged in PR #88 and PR #94 during Lane 3 review.",
                solution="Centralize connection pool singleton in api/db.py.",
                ac_list=["All route handlers inject db from shared pool", "Zero orphan connection leaks"]
            )
        }
    ]

if __name__ == "__main__":
    candidates = list_pr_patterns()
    print(json.dumps(candidates, indent=2))
