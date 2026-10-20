#!/usr/bin/env bash
# TSGF Installer: install.sh
# Copies skills/, scripts/, workflows/ and guard hooks into target project's .agents/ tree,
# links them into host directories (.claude/, .codex/, .opencode/),
# and merges hook settings into .claude/settings.json.
#
# Usage:
#   ./install.sh [--no-hooks] [--protect-main] [--hosts claude,codex,opencode] [target-project-dir]

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOKS=1
PROTECT=0
TARGET=""
ASKED_HOSTS=""
want_hosts=0

for arg in "$@"; do
  if [ "$want_hosts" -eq 1 ]; then ASKED_HOSTS="$ASKED_HOSTS,$arg"; want_hosts=0; continue; fi
  case "$arg" in
    --no-hooks) HOOKS=0 ;;
    --protect-main) PROTECT=1 ;;
    --hosts) want_hosts=1 ;;
    --hosts=*) ASKED_HOSTS="$ASKED_HOSTS,${arg#--hosts=}" ;;
    -h|--help)
      sed -n '2,15p' "$0"
      exit 0
      ;;
    -*) echo "Unknown option: $arg" >&2; exit 64 ;;
    *) TARGET="$arg" ;;
  esac
done

TARGET="${TARGET:-$PWD}"
[ -d "$TARGET" ] || { echo "Target directory not found: $TARGET" >&2; exit 64; }
TARGET="$(cd "$TARGET" && pwd)"

PACK_VERSION="$(tr -d '[:space:]' < "$REPO_ROOT/VERSION" 2>/dev/null || echo '1.0.0')"
SHARED="$TARGET/.agents"

echo "⚡ Installing TSGF v$PACK_VERSION into: $TARGET"

# 1. Create target directories
mkdir -p "$SHARED/skills" "$SHARED/bin" "$SHARED/workflows" "$SHARED/hooks"
mkdir -p "$TARGET/.claude/tsgf"

# 2. Copy skills
SKILLS="tsgf tsgf-build tsgf-qa tsgf-review tsgf-collect tsgf-sync ui-refine-loop visual"
for s in $SKILLS; do
  if [ -d "$REPO_ROOT/skills/$s" ]; then
    mkdir -p "$SHARED/skills/$s"
    cp -R "$REPO_ROOT/skills/$s/." "$SHARED/skills/$s/"
  fi
done
[ -f "$REPO_ROOT/skills/families.json" ] && cp "$REPO_ROOT/skills/families.json" "$SHARED/skills/"
echo "   ✓ Installed 8 skills into .agents/skills/"

# 3. Copy scripts to .agents/bin
for sc in "$REPO_ROOT"/scripts/*; do
  [ -f "$sc" ] || continue
  cp "$sc" "$SHARED/bin/"
  chmod +x "$SHARED/bin/$(basename "$sc")"
done
echo "   ✓ Installed execution scripts into .agents/bin/"

# 4. Copy workflows
for wf in "$REPO_ROOT"/workflows/*; do
  [ -f "$wf" ] || continue
  cp "$wf" "$SHARED/workflows/"
done
echo "   ✓ Installed workflows into .agents/workflows/"

# 5. Copy hooks & wire settings
if [ "$HOOKS" -eq 1 ]; then
  for h in "$REPO_ROOT"/hooks/*.py; do
    [ -f "$h" ] || continue
    cp "$h" "$SHARED/hooks/"
    chmod +x "$SHARED/hooks/$(basename "$h")"
  done

  SNIPPETS="$REPO_ROOT/hooks/settings-snippet.json"
  if [ "$PROTECT" -eq 1 ]; then
    SNIPPETS="$SNIPPETS $REPO_ROOT/hooks/settings-protect-main.json"
  fi

  python3 "$REPO_ROOT/scripts/tsgf-settings.py" hooks "$TARGET/.claude/settings.json" $SNIPPETS >/dev/null 2>&1 || true
  echo "   🛡️ Configured guard hooks in .claude/settings.json"
fi

# 6. Link into host directories (.claude/ always; .codex/ if present)
mkdir -p "$TARGET/.claude/skills" "$TARGET/.claude/bin"
for s in $SKILLS; do
  rm -rf "$TARGET/.claude/skills/$s"
  ln -sf "../../.agents/skills/$s" "$TARGET/.claude/skills/$s" 2>/dev/null || cp -R "$SHARED/skills/$s" "$TARGET/.claude/skills/$s"
done
for sc in "$SHARED"/bin/*; do
  [ -f "$sc" ] || continue
  base="$(basename "$sc")"
  rm -f "$TARGET/.claude/bin/$base"
  ln -sf "../../.agents/bin/$base" "$TARGET/.claude/bin/$base" 2>/dev/null || cp "$sc" "$TARGET/.claude/bin/$base"
done

# 7. Update AGENTS.md
python3 "$REPO_ROOT/scripts/tsgf-agents-md.py" --root "$TARGET" --version "$PACK_VERSION" >/dev/null 2>&1 || true

echo "🎉 TSGF v$PACK_VERSION is installed!"
echo "👉 Next: In your agent session, run: /tsgf onboard"
