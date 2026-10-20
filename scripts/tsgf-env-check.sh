#!/usr/bin/env bash
# TSGF: tsgf-env-check.sh
# Verifies environment tools, API access, and dependencies for TSGF.

set -euo pipefail

say() { printf '  %s\n' "$*"; }

echo "🔍 [tsgf-env-check] Auditing local environment..."

ok=0
warn=0

check_cmd() {
  local cmd="$1"
  local desc="$2"
  if command -v "$cmd" >/dev/null 2>&1; then
    local ver
    ver="$("$cmd" --version 2>&1 | head -n 1 || echo "")"
    say "✓ $cmd: present ($ver)"
    ok=$((ok + 1))
  else
    say "✗ $cmd: missing ($desc)"
    warn=$((warn + 1))
  fi
}

check_cmd "git" "Version control"
check_cmd "python3" "Script runner & hooks"
check_cmd "gh" "GitHub CLI (project & PR management)"
check_cmd "jq" "JSON processor"
check_cmd "node" "Runtime for workflows"

# Check GitHub auth status
if command -v gh >/dev/null 2>&1; then
  if gh auth status >/dev/null 2>&1; then
    say "✓ gh auth: authenticated"
  else
    say "⚠️ gh auth: not logged in (run 'gh auth login')"
    warn=$((warn + 1))
  fi
fi

echo "Summary: $ok tools verified, $warn warning(s)."
[ "$warn" -eq 0 ] || exit 1
exit 0
