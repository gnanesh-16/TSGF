#!/usr/bin/env bash
# TSGF: tsgf-stop.sh
# Gracefully stops running worker lanes and cleans up inflight locks.

set -euo pipefail

echo "🛑 [tsgf-stop] Stopping active TSGF workers..."

LOCK_DIR=".claude/tsgf/inflight"
if [ -d "$LOCK_DIR" ]; then
  for lock in "$LOCK_DIR"/*; do
    [ -f "$lock" ] || continue
    pid="$(cat "$lock" 2>/dev/null || echo "")"
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
      echo "Killing worker PID $pid ($(basename "$lock"))"
      kill -TERM "$pid" 2>/dev/null || true
    fi
    rm -f "$lock"
  done
fi

echo "✓ All active TSGF workers stopped and locks released."
exit 0
