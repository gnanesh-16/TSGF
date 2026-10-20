#!/usr/bin/env bash
# TSGF: tsgf-gh-guard.sh
# Token bucket rate-limit guard for GitHub CLI calls.
# Sourced by workers and scripts before bursting `gh` API operations.

set -euo pipefail

tsgf_gh_guard_check() {
  local required_minimum="${1:-100}"
  
  if ! command -v gh >/dev/null 2>&1; then
    return 0
  fi

  # Check rate limits
  local limits
  limits="$(gh api rate_limit 2>/dev/null || echo "")"
  if [ -z "$limits" ]; then
    return 0
  fi

  local graphql_remaining rest_remaining
  graphql_remaining="$(echo "$limits" | python3 -c 'import json,sys
try:
  data = json.load(sys.stdin)
  print(data.get("resources", {}).get("graphql", {}).get("remaining", 5000))
except Exception:
  print(5000)' 2>/dev/null || echo 5000)"

  rest_remaining="$(echo "$limits" | python3 -c 'import json,sys
try:
  data = json.load(sys.stdin)
  print(data.get("resources", {}).get("core", {}).get("remaining", 5000))
except Exception:
  print(5000)' 2>/dev/null || echo 5000)"

  if [ "$graphql_remaining" -lt "$required_minimum" ] || [ "$rest_remaining" -lt "$required_minimum" ]; then
    echo "⚠️ [tsgf-gh-guard] Low GitHub API quota remaining (GraphQL: $graphql_remaining, REST: $rest_remaining, minimum: $required_minimum)." >&2
    echo "   Backing off to preserve quota for critical merge operations." >&2
    return 1
  fi

  return 0
}

# If executed directly, run the check
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  tsgf_gh_guard_check "${1:-200}"
fi
