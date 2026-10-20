#!/usr/bin/env bash
# TSGF Test: test_install.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "🧪 Testing install.sh in temporary directory: $tmp..."

# Run install.sh into tmp
"$ROOT/install.sh" "$tmp"

# Verify installed tree
[ -d "$tmp/.agents/skills/tsgf" ] || { echo "Missing .agents/skills/tsgf" >&2; exit 1; }
[ -d "$tmp/.agents/skills/tsgf-build" ] || { echo "Missing .agents/skills/tsgf-build" >&2; exit 1; }
[ -d "$tmp/.agents/skills/tsgf-qa" ] || { echo "Missing .agents/skills/tsgf-qa" >&2; exit 1; }
[ -d "$tmp/.agents/skills/tsgf-review" ] || { echo "Missing .agents/skills/tsgf-review" >&2; exit 1; }
[ -f "$tmp/.agents/bin/tsgf-run.sh" ] || { echo "Missing .agents/bin/tsgf-run.sh" >&2; exit 1; }
[ -f "$tmp/.agents/hooks/guard-secrets.py" ] || { echo "Missing .agents/hooks/guard-secrets.py" >&2; exit 1; }
[ -f "$tmp/.claude/settings.json" ] || { echo "Missing .claude/settings.json" >&2; exit 1; }
[ -f "$tmp/AGENTS.md" ] || { echo "Missing AGENTS.md" >&2; exit 1; }

echo "✓ install.sh tests passed."
exit 0
