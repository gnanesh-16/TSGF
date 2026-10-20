#!/usr/bin/env bash
# TSGF one-line installer.
#
#   curl -fsSL https://raw.githubusercontent.com/gnanesh-16/TSGF/main/get.sh | bash
#   curl -fsSL https://raw.githubusercontent.com/gnanesh-16/TSGF/main/get.sh | bash -s -- --protect-main
#
# Options:
#   --target <dir>        project to install into (default: the current folder)
#   --ref <tag|branch>    which version to fetch (default: main)
#   -h, --help            show this help

set -euo pipefail

say()  { printf '%s\n' "$*"; }
warn() { printf '⚠️  %s\n' "$*" >&2; }
die()  { printf '❌ %s\n' "$*" >&2; exit "${2:-1}"; }
have() { command -v "$1" >/dev/null 2>&1; }

main() {
  local target="" ref="${TSGF_REF:-main}"
  local repo="${TSGF_REPO:-gnanesh-16/TSGF}"
  local pass=()

  while [ $# -gt 0 ]; do
    case "$1" in
      --target) target="$2"; shift 2 ;;
      --target=*) target="${1#--target=}"; shift ;;
      --ref) ref="$2"; shift 2 ;;
      --ref=*) ref="${1#--ref=}"; shift ;;
      -h|--help) sed -n '2,12p' "$0"; exit 0 ;;
      -*) pass+=("$1"); shift ;;
      *) target="$1"; shift ;;
    esac
  done
  target="${target:-$PWD}"

  if [ "$(id -u)" -eq 0 ]; then
    die "Please do not run this as root/sudo. Run it as your normal user in your project directory." 1
  fi
  [ -d "$target" ] || die "Target '$target' is not a directory." 64
  target="$(cd "$target" && pwd)"

  say "⚡ TSGF Installer"
  say "   Target: $target"

  have git || die "git is required. Please install git and retry." 69
  have python3 || die "python3 is required. Please install Python 3 and retry." 69

  local tmp
  tmp="$(mktemp -d 2>/dev/null || mktemp -d -t tsgf)"
  trap 'rm -rf "$tmp"' EXIT INT TERM

  say "📦 Fetching $repo@$ref..."
  git clone -q --depth 1 --branch "$ref" "https://github.com/$repo.git" "$tmp/tsgf" || die "Failed to clone repository." 1

  bash "$tmp/tsgf/install.sh" ${pass[@]+"${pass[@]}"} "$target"
}

main "$@"
