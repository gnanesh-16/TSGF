#!/usr/bin/env bash
# TSGF: tsgf-pr-body.sh
# Surgically updates or reads named blocks inside a pull request body.
# Blocks follow the standard:
#   <!-- tsgf:<block>:begin -->
#   ... content ...
#   <!-- tsgf:<block>:end -->
#
# Usage:
#   tsgf-pr-body.sh get <block> [file]
#   tsgf-pr-body.sh set <block> <content-or-file> [file]
#   tsgf-pr-body.sh init [file]

set -euo pipefail

BLOCKS="status problem solution ac history visual risk"

init_body() {
  cat <<'EOF'
<!-- tsgf:status:begin -->
🟡 **Status:** In Progress
<!-- tsgf:status:end -->

### Problem
<!-- tsgf:problem:begin -->
_Describe the problem this PR addresses._
<!-- tsgf:problem:end -->

### Solution
<!-- tsgf:solution:begin -->
_Describe the implemented changes._
<!-- tsgf:solution:end -->

### Acceptance Criteria
<!-- tsgf:ac:begin -->
- [ ] Task acceptance criteria
<!-- tsgf:ac:end -->

### Visual Evidence
<!-- tsgf:visual:begin -->
_Screenshots, test logs, or demo output._
<!-- tsgf:visual:end -->

### Risk & Rollback
<!-- tsgf:risk:begin -->
Low risk. Standard revert applies.
<!-- tsgf:risk:end -->

### Handoff History
<!-- tsgf:history:begin -->
_Lane execution history will be appended here._
<!-- tsgf:history:end -->
EOF
}

get_block() {
  local block="$1"
  local file="${2:-/dev/stdin}"
  python3 - "$block" "$file" <<'PY'
import sys, re

block = sys.argv[1]
filepath = sys.argv[2]
content = sys.stdin.read() if filepath == "/dev/stdin" else open(filepath).read()

pattern = rf"<!-- tsgf:{re.escape(block)}:begin -->\n?(.*?)\n?<!-- tsgf:{re.escape(block)}:end -->"
match = re.search(pattern, content, re.DOTALL)
if match:
    print(match.group(1))
else:
    sys.exit(1)
PY
}

set_block() {
  local block="$1"
  local new_content="$2"
  local file="${3:-}"

  # If new_content is an existing file, read it
  if [ -f "$new_content" ]; then
    new_content="$(cat "$new_content")"
  fi

  python3 - "$block" "$new_content" "$file" <<'PY'
import sys, re

block = sys.argv[1]
new_text = sys.argv[2].strip()
filepath = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] else None

if filepath and filepath != "/dev/stdin":
    content = open(filepath).read()
else:
    content = sys.stdin.read()

begin_tag = f"<!-- tsgf:{block}:begin -->"
end_tag = f"<!-- tsgf:{block}:end -->"
replacement = f"{begin_tag}\n{new_text}\n{end_tag}"

pattern = rf"<!-- tsgf:{re.escape(block)}:begin -->.*?<!-- tsgf:{re.escape(block)}:end -->"
if re.search(pattern, content, re.DOTALL):
    updated = re.sub(pattern, replacement, content, flags=re.DOTALL)
else:
    # If block doesn't exist, append it
    updated = content.rstrip() + f"\n\n{replacement}\n"

if filepath and filepath != "/dev/stdin":
    with open(filepath, "w") as f:
        f.write(updated)
else:
    print(updated)
PY
}

case "${1:-}" in
  init)
    if [ $# -ge 2 ]; then
      init_body > "$2"
    else
      init_body
    fi
    ;;
  get)
    [ $# -ge 2 ] || { echo "Usage: tsgf-pr-body.sh get <block> [file]" >&2; exit 64; }
    get_block "$2" "${3:-/dev/stdin}"
    ;;
  set)
    [ $# -ge 3 ] || { echo "Usage: tsgf-pr-body.sh set <block> <content-or-file> [file]" >&2; exit 64; }
    set_block "$2" "$3" "${4:-/dev/stdin}"
    ;;
  *)
    echo "Usage: tsgf-pr-body.sh init|get|set ..." >&2
    exit 64
    ;;
esac
