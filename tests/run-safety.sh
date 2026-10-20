#!/usr/bin/env bash
# TSGF Test Runner: run-safety.sh
# Discovers and executes all tests in tests/

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TESTS_DIR="$ROOT/tests"

echo "🧪 Running TSGF Safety & Verification Suite..."
echo "=============================================="

total=0
passed=0

for test_file in "$TESTS_DIR"/test_*.py "$TESTS_DIR"/test_*.sh; do
  [ -f "$test_file" ] || continue
  test_name="$(basename "$test_file")"
  echo -n "▶ Running $test_name... "
  total=$((total + 1))

  if [[ "$test_file" == *.py ]]; then
    if python3 "$test_file" >/dev/null 2>&1; then
      echo "PASS"
      passed=$((passed + 1))
    else
      echo "FAIL"
      python3 "$test_file"
      exit 1
    fi
  elif [[ "$test_file" == *.sh ]]; then
    if bash "$test_file" >/dev/null 2>&1; then
      echo "PASS"
      passed=$((passed + 1))
    else
      echo "FAIL"
      bash "$test_file"
      exit 1
    fi
  fi
done

echo "=============================================="
echo "🎉 Suite Result: $passed / $total test(s) passed."
exit 0
