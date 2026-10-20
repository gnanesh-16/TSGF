#!/usr/bin/env python3
"""
TSGF Signal Collection: collect_common.py
Shared utilities for parsing telemetry, computing stable deduplication fingerprints,
and formatting candidates into the TSGF ticket standard.
"""
import hashlib
import json
import re
import sys
from datetime import datetime, timezone, timedelta

def compute_fingerprint(source: str, category: str, identifier: str) -> str:
    """Generate clean, unique fingerprint for deduplicating tickets."""
    clean_id = re.sub(r'[\s/\\:]+', '|', str(identifier).strip())
    return f"{source}|{category}|{clean_id}"

def parse_window(window_days: int = 14) -> datetime:
    """Calculate the since timestamp for queries."""
    return datetime.now(timezone.utc) - timedelta(days=window_days)

def format_ticket_body(title: str, problem: str, context: str, solution: str, ac_list: list[str]) -> str:
    """Format markdown ticket adhering to TSGF writing standards."""
    acs = "\n".join(f"- [ ] {ac}" for ac in ac_list)
    return f"""## Problem
{problem.strip()}

## Context
{context.strip()}

## Solution
{solution.strip()}

## Acceptance Criteria
{acs}
"""

if __name__ == "__main__":
    fp = compute_fingerprint("sentry", "error", "ZeroDivisionError in api.py:42")
    print(f"Generated fingerprint: {fp}")
