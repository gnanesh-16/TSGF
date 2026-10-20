#!/usr/bin/env bash
# TSGF Test: test_pr_body.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN="$ROOT/scripts/tsgf-pr-body.sh"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

test_file="$tmp/PR_BODY.md"

echo "🧪 Testing tsgf-pr-body.sh..."

# 1. Initialize body
"$BIN" init "$test_file"
grep -q "<!-- tsgf:status:begin -->" "$test_file"

# 2. Update status block
"$BIN" set status "🟢 **Status:** QA Passed" "$test_file"
val="$("$BIN" get status "$test_file")"
if [ "$val" != "🟢 **Status:** QA Passed" ]; then
  echo "Expected '🟢 **Status:** QA Passed', got '$val'" >&2
  exit 1
fi

# 3. Update solution block
"$BIN" set solution "Added background token refresh." "$test_file"
val="$("$BIN" get solution "$test_file")"
if [ "$val" != "Added background token refresh." ]; then
  echo "Expected 'Added background token refresh.', got '$val'" >&2
  exit 1
fi

echo "✓ tsgf-pr-body.sh tests passed."
exit 0
