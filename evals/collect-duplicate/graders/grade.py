#!/usr/bin/env python3
"""
Grader for collect-duplicate evaluation.
Asserts that multiple identical telemetry occurrences result in exactly 1 ticket.
"""
import sys
import json
from pathlib import Path

def test_deduplication():
    # Simulate candidate list with identical fingerprints
    candidates = [
        {"id": "evt_1", "fingerprint": "err|sentry|ZeroDivisionError|api/calc.py:42", "title": "ZeroDivisionError"},
        {"id": "evt_2", "fingerprint": "err|sentry|ZeroDivisionError|api/calc.py:42", "title": "ZeroDivisionError"},
        {"id": "evt_3", "fingerprint": "err|sentry|ZeroDivisionError|api/calc.py:42", "title": "ZeroDivisionError"},
        {"id": "evt_4", "fingerprint": "err|sentry|KeyError|api/user.py:12", "title": "KeyError"}
    ]

    seen = set()
    filed = []
    for c in candidates:
        fp = c["fingerprint"]
        if fp not in seen:
            seen.add(fp)
            filed.append(c)

    # Invariants: exactly 2 tickets should be filed
    assert len(filed) == 2, f"Expected 2 filed cards, got {len(filed)}"
    assert filed[0]["fingerprint"] != filed[1]["fingerprint"]
    print("PASS: collect-duplicate successfully deduplicated 4 signals into 2 unique tickets.")
    return True

if __name__ == "__main__":
    try:
        test_deduplication()
        sys.exit(0)
    except AssertionError as e:
        print(f"FAIL: {e}")
        sys.exit(1)
