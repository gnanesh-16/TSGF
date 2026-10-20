#!/usr/bin/env bash
# TSGF: tsgf-run.sh
# Main orchestrator runner for TSGF waves.
# Plans waves, claims tasks, spins up worker lanes, and merges verified PRs.

set -euo pipefail

BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$BIN_DIR/.." && pwd)"

echo "⚡ [tsgf-run] Starting TSGF Autonomous Software Factory..."

# 1. Preflight checks
bash "$BIN_DIR/tsgf-preflight.sh" || { echo "❌ Preflight failed." >&2; exit 1; }

# 2. Check skills readiness
python3 "$BIN_DIR/tsgf-skills-ready.py" || { echo "❌ Skills check failed." >&2; exit 1; }

# 3. Quota check
bash "$BIN_DIR/tsgf-gh-guard.sh" 100 || { echo "⚠️ Quota too low to dispatch." >&2; exit 1; }

# 4. Plan execution wave
WAVE_PLAN="$(python3 "$BIN_DIR/tsgf-wave-plan.sh")"
WAVE_COUNT="$(echo "$WAVE_PLAN" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("wave_count", 0))')"

if [ "$WAVE_COUNT" -eq 0 ]; then
  echo "☕ No cards currently in Ready. Board is idle."
  python3 "$BIN_DIR/tsgf-status.py"
  exit 0
fi

echo "🌊 Dispatching $WAVE_COUNT wave(s) of tasks..."
echo "$WAVE_PLAN" | python3 -c 'import json,sys
data = json.load(sys.stdin)
for i, wave in enumerate(data.get("waves", [])):
    print(f"\n--- Wave {i+1} ({len(wave)} tasks) ---")
    for task in wave:
        print(f"  • #{task.get(\"id\")}: {task.get(\"title\")} (Lane: {task.get(\"start_lane\")})")
'

echo "✓ Wave planned. Ready for agent lane execution."
exit 0
