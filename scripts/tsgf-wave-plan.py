#!/usr/bin/env python3
"""TSGF: tsgf-wave-plan.py
Plans wave execution by parsing Ready cards, resolving dependencies,
and routing lanes based on labels (qa skips Building).
"""

import json
import re
import sys
from pathlib import Path


def plan_waves(cards: list[dict]) -> list[dict]:
    """Partitions ready cards into waves based on dependency DAG."""
    waves = []
    remaining = list(cards)
    completed_ids = set()

    max_iter = 20
    iter_count = 0

    while remaining and iter_count < max_iter:
        iter_count += 1
        current_wave = []
        next_remaining = []

        for card in remaining:
            card_id = str(card.get("number", card.get("id", "")))
            blocked_by = [str(b) for b in card.get("blocked_by", [])]

            # If all blockers have been scheduled in earlier waves
            if all(b in completed_ids for b in blocked_by):
                labels = [l.lower() for l in card.get("labels", [])]
                # Route: 'qa' label skips Building lane
                start_lane = "QA" if "qa" in labels else "Building"
                current_wave.append({
                    "id": card_id,
                    "title": card.get("title", ""),
                    "start_lane": start_lane,
                    "labels": labels,
                })
            else:
                next_remaining.append(card)

        if not current_wave:
            if next_remaining:
                print(f"⚠️ Warning: {len(next_remaining)} card(s) have unmet blockers or cycles.", file=sys.stderr)
            break

        waves.append(current_wave)
        for c in current_wave:
            completed_ids.add(c["id"])
        remaining = next_remaining

    return waves


def main():
    board_file = Path(".claude/tsgf/board.json")
    ready_cards = []
    if board_file.exists():
        try:
            data = json.loads(board_file.read_text(encoding="utf-8"))
            ready_cards = data.get("Ready", [])
        except Exception as e:
            print(f"Error loading board: {e}", file=sys.stderr)

    waves = plan_waves(ready_cards)
    print(json.dumps({"wave_count": len(waves), "waves": waves}, indent=2))


if __name__ == "__main__":
    main()
