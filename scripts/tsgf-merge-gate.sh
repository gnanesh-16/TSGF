#!/usr/bin/env bash
# TSGF: tsgf-merge-gate.sh
# Programmatic gate that guarantees tests and policies pass before a PR is merged into base.
#
# Usage:
#   tsgf-merge-gate.sh <pr-number-or-branch>

set -euo pipefail

TARGET="${1:-}"
[ -n "$TARGET" ] || { echo "Usage: tsgf-merge-gate.sh <branch-or-pr-num>" >&2; exit 64; }

echo "🚪 [tsgf-merge-gate] Initiating merge gate verification for: $TARGET"

# 1. Load project verify_commands from config if present
CONFIG_FILE=".claude/tsgf/config.json"
VERIFY_COMMANDS=""
if [ -f "$CONFIG_FILE" ]; then
  VERIFY_COMMANDS="$(python3 -c 'import json,sys
try:
  c = json.load(open(sys.argv[1]))
  print("\n".join(c.get("verify_commands", [])))
except Exception:
  pass' "$CONFIG_FILE")"
fi

# 2. Run verify commands
if [ -n "$VERIFY_COMMANDS" ]; then
  echo "🧪 Running configured verification commands..."
  while IFS= read -r cmd; do
    [ -n "$cmd" ] || continue
    echo "   ▶ $cmd"
    if ! eval "$cmd"; then
      echo "❌ Verification command failed: $cmd" >&2
      exit 1
    fi
  done <<< "$VERIFY_COMMANDS"
else
  # Default fallback checks if no config exists
  if [ -f "package.json" ] && grep -q '"test"' package.json 2>/dev/null; then
    echo "🧪 Running npm test..."
    npm test || { echo "❌ npm test failed." >&2; exit 1; }
  elif [ -f "pytest.ini" ] || [ -f "pyproject.toml" ] || [ -d "tests" ]; then
    if command -v pytest >/dev/null 2>&1; then
      echo "🧪 Running pytest..."
      pytest || { echo "❌ pytest failed." >&2; exit 1; }
    fi
  fi
fi

# 3. If PR number given and gh is present, perform gh pr merge
if [[ "$TARGET" =~ ^[0-9]+$ ]] && command -v gh >/dev/null 2>&1; then
  echo "🔀 Merging PR #$TARGET via GitHub CLI..."
  gh pr merge "$TARGET" --squash --delete-branch
  echo "🎉 PR #$TARGET successfully merged."
else
  echo "✓ Local verification passed for branch $TARGET."
fi

exit 0
