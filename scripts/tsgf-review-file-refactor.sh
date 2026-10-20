#!/usr/bin/env bash
# TSGF: tsgf-review-file-refactor.sh
# Files an architectural improvement or refactoring card into Backlog.

set -euo pipefail

TITLE="${1:-}"
REASON="${2:-}"

[ -n "$TITLE" ] || { echo "Usage: tsgf-review-file-refactor.sh <title> [reason]" >&2; exit 64; }

BOARD_FILE=".claude/tsgf/board.json"
python3 - "$TITLE" "$REASON" "$BOARD_FILE" <<'PY'
import json, sys, time
from pathlib import Path

title = sys.argv[1]
reason = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else ""
board_path = Path(sys.argv[3])

board = {"Backlog": []}
if board_path.exists():
    try:
        board = json.loads(board_path.read_text(encoding="utf-8"))
    except Exception:
        pass

all_cards = [c for col in board.values() for c in col]
next_id = max([int(c.get("number", 0)) for c in all_cards] + [100]) + 1

new_card = {
    "number": str(next_id),
    "title": f"♻️ {title}",
    "labels": ["refactor", "review-finding"],
    "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "context": reason,
}

board.setdefault("Backlog", []).append(new_card)
board_path.parent.mkdir(parents=True, exist_ok=True)
board_path.write_text(json.dumps(board, indent=2), encoding="utf-8")

print(f"✓ Filed refactor card #{next_id}: '{title}' in Backlog.")
PY
