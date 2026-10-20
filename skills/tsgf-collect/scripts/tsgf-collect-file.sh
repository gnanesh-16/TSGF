#!/usr/bin/env bash
# TSGF Signal Collection: tsgf-collect-file.sh
# Formats verified candidate tickets and files them to the Backlog column of GitHub Project board.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TITLE="${1:-}"
BODY_FILE="${2:-}"
LABEL="${3:-bug}"

if [ -z "$TITLE" ] || [ -z "$BODY_FILE" ]; then
  echo "Usage: $0 <title> <body-file> [label]"
  exit 1
fi

BODY="$(cat "$BODY_FILE")"

echo "📥 [tsgf-collect] Filing verified candidate to Backlog: '$TITLE'"

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  gh issue create --title "$TITLE" --body "$BODY" --label "$LABEL"
  echo "✅ Card filed to GitHub Issues successfully."
else
  echo "ℹ️ (Offline dry-run) Would file issue with label '$LABEL':"
  echo "Title: $TITLE"
  head -n 6 "$BODY_FILE"
fi
