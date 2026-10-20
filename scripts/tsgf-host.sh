#!/usr/bin/env bash
# TSGF: tsgf-host.sh
# Detects the current agent host environment.

set -euo pipefail

if [ -n "${ANTIGRAVITY_APP_DIR:-}" ] || [ -d "${HOME}/.gemini/antigravity-ide" ]; then
  echo "antigravity"
elif [ -n "${CLAUDE_CODE_VERSION:-}" ] || [ -d "${HOME}/.claude" ]; then
  echo "claude"
elif [ -n "${CODEX_VERSION:-}" ] || [ -d "${HOME}/.codex" ]; then
  echo "codex"
elif [ -d "${HOME}/.opencode" ]; then
  echo "opencode"
else
  echo "generic"
fi
