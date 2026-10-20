#!/usr/bin/env python3
"""TSGF Test: test_wave_plan.py
Tests dependency wave resolution and label routing.
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import importlib.util

spec = importlib.util.spec_from_file_location("wave_plan", str(ROOT / "scripts" / "tsgf-wave-plan.py"))
wp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wp)


def test_wave_planning():
    cards = [
        {"number": "101", "title": "Base auth", "blocked_by": [], "labels": ["feature"]},
        {"number": "102", "title": "User profile", "blocked_by": ["101"], "labels": ["feature"]},
        {"number": "103", "title": "Verify login redirect", "blocked_by": [], "labels": ["qa"]},
    ]

    waves = wp.plan_waves(cards)
    assert len(waves) == 2, f"Expected 2 waves, got {len(waves)}"

    # Wave 1 should have 101 and 103
    wave1_ids = {c["id"] for c in waves[0]}
    assert "101" in wave1_ids and "103" in wave1_ids

    # Card 103 should start in QA lane
    c103 = next(c for c in waves[0] if c["id"] == "103")
    assert c103["start_lane"] == "QA", f"Expected QA, got {c103['start_lane']}"

    # Wave 2 should have 102
    wave2_ids = {c["id"] for c in waves[1]}
    assert "102" in wave2_ids

    print("✓ Wave planning tests passed.")


if __name__ == "__main__":
    test_wave_planning()
