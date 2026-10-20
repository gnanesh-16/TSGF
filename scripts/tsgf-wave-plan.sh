#!/usr/bin/env bash
# TSGF: tsgf-wave-plan.sh wrapper
set -euo pipefail
BIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python3 "$BIN_DIR/tsgf-wave-plan.py" "$@"
