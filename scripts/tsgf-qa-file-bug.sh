#!/usr/bin/env bash
# TSGF: tsgf-qa-file-bug.sh
# Files a verified bug report discovered by the QA lane into the Backlog.

set -euo pipefail

TITLE="${1:-}"
EVIDENCE="${2:-}"

[ -n "$TITLE" ] || { echo "Usage: tsgf-qa-file-bug.sh <title> [evidence-file]" >&2; exit 64; }

BOARD_FILE=".claude/tsgf/board.json"
python3 - "$TITLE" "$EVIDENCE" "$BOARD_FILE" <<'PY'
import json, sys, time
from pathlib import Path

title = sys.argv[1]
evidence_file = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else ""
board_path = Path(sys.argv[3])

evidence = ""
if evidence_file and Path(evidence_file).exists():
    evidence = Path(evidence_file).read_text(encoding="utf-8")

board = {"Backlog": []}
if board_path.exists():
    try:
        board = json.loads(board_path.read_text(encoding="utf-8"))
    except Exception:
        pass

# Generate card ID
all_cards = [c for col in board.values() for c in col]
next_id = max([int(c.get("number", 0)) for c in all_cards] + [100]) + 1

new_card = {
    "number": str(next_id),
    "title": f"🐛 {title}",
    "labels": ["bug", "qa-discovered"],
    "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "evidence": evidence,
}

board.setdefault("Backlog", []).append(new_card)
board_path.parent.mkdir(parents=True, exist_ok=True)
board_path.write_text(json.dumps(board, indent=2), encoding="utf-8")

print(f"✓ Filed bug card #{next_id}: '{title}' in Backlog.")
PY
