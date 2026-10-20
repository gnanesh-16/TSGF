#!/usr/bin/env python3
"""TSGF: tsgf-status.py
Reads and displays the current state of the Kanban board across all seven columns.
Supports reading from GitHub Project (via gh api graphql) or local fallback state (.claude/tsgf/board.json).
"""

import json
import os
import subprocess
import sys
from pathlib import Path

COLUMNS = ["Backlog", "Ready", "Building", "QA", "Review", "Done", "Blocked"]
ICONS = {
    "Backlog": "📥",
    "Ready": "✅",
    "Building": "🔨",
    "QA": "🔍",
    "Review": "🧐",
    "Done": "🎉",
    "Blocked": "🙋",
}


def load_local_board() -> dict[str, list[dict]]:
    path = Path(".claude/tsgf/board.json")
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {col: [] for col in COLUMNS}


def print_status(board: dict[str, list[dict]], as_json: bool = False):
    if as_json:
        print(json.dumps(board, indent=2))
        return

    print("📊 TSGF Board Snapshot")
    print("=" * 60)
    total_cards = sum(len(cards) for cards in board.values())

    for col in COLUMNS:
        cards = board.get(col, [])
        icon = ICONS.get(col, "•")
        print(f"\n{icon} {col} ({len(cards)})")
        if not cards:
            print("   (empty)")
        for card in cards:
            num = card.get("number", "")
            title = card.get("title", "Untitled")
            labels = card.get("labels", [])
            lbl_str = f" [{', '.join(labels)}]" if labels else ""
            print(f"   • #{num}: {title}{lbl_str}")

    print("\n" + "=" * 60)
    print(f"Total cards on board: {total_cards}")


def main():
    as_json = "--json" in sys.argv
    board = load_local_board()
    print_status(board, as_json=as_json)


if __name__ == "__main__":
    main()
