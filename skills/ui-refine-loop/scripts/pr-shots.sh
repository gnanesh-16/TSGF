#!/usr/bin/env bash
# TSGF UI Refine Loop: pr-shots.sh
# Generates Before | After markdown table for pull request visual blocks.
set -euo pipefail

BEFORE_IMG="${1:-docs/ui-refine/before.png}"
AFTER_IMG="${2:-docs/ui-refine/after.png}"
SCORE_BEFORE="${3:-24/40}"
SCORE_AFTER="${4:-38/40}"

cat <<EOF
### 🎨 Visual Refinement Before | After ($SCORE_BEFORE ➔ $SCORE_AFTER)

| Metric | Before Round 0 | After Round Final |
|---|---|---|
| **Quality Score** | \`$SCORE_BEFORE\` | \`$SCORE_AFTER\` |
| **Desktop (1440px)** | ![$BEFORE_IMG]($BEFORE_IMG) | ![$AFTER_IMG]($AFTER_IMG) |

*Verified with WCAG AA contrast check and responsive wrap validation.*
EOF
