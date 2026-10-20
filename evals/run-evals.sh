#!/usr/bin/env bash
# TSGF Autonomous Evaluation Suite Runner
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "📊 Running TSGF Evals Suite..."
echo "=============================================="

TOTAL=0
PASSED=0

for CASE_DIR in "$SCRIPT_DIR"/*/; do
  [ -d "$CASE_DIR" ] || continue
  CASE_NAME="$(basename "$CASE_DIR")"
  
  if [ -f "$CASE_DIR/graders/grade.py" ]; then
    TOTAL=$((TOTAL + 1))
    echo -n "▶ Evaluating case [$CASE_NAME]... "
    if python3 "$CASE_DIR/graders/grade.py" > /dev/null 2>&1; then
      echo "PASS"
      PASSED=$((PASSED + 1))
    else
      echo "FAIL"
      python3 "$CASE_DIR/graders/grade.py" || true
    fi
  fi
done

echo "=============================================="
echo "🎯 Evals Result: $PASSED / $TOTAL passed."

if [ "$PASSED" -eq "$TOTAL" ]; then
  exit 0
else
  exit 1
fi
