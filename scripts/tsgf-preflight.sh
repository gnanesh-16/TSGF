#!/usr/bin/env bash
# TSGF: tsgf-preflight.sh
# Verifies repository preconditions before initiating an autonomous run wave.

set -euo pipefail

say() { printf '  %s\n' "$*"; }
err() { printf '❌ %s\n' "$*" >&2; }

echo "🔍 [tsgf-preflight] Checking preconditions..."

# 1. Git repository check
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  err "Not inside a valid git repository."
  exit 1
fi

# 2. Check for uncommitted changes on current branch
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  echo "⚠️ Working directory contains uncommitted changes." >&2
  echo "   TSGF recommends running from a clean git state or stashing modifications." >&2
fi

# 3. Check for required CLI utilities
missing=""
for tool in git python3; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    missing="$missing $tool"
  fi
done

if [ -n "$missing" ]; then
  err "Missing required dependencies:$missing"
  exit 69
fi

# 4. Check for lockfiles
LOCK_DIR=".claude/tsgf/inflight"
if [ -d "$LOCK_DIR" ] && [ "$(ls -A "$LOCK_DIR" 2>/dev/null)" ]; then
  echo "⚠️ Active worker lockfile(s) detected in $LOCK_DIR."
  for lock in "$LOCK_DIR"/*; do
    [ -f "$lock" ] || continue
    say "Found lock: $(basename "$lock")"
  done
fi

say "✓ Preflight checks passed."
exit 0
