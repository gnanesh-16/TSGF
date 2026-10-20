#!/usr/bin/env python3
"""TSGF: tsgf-settings.py
Safely merges TSGF hook definitions into target `.claude/settings.json`.
Preserves all user settings, avoids duplicates, and creates backups.
"""

import json
import shutil
import sys
from pathlib import Path


def merge_hooks(target_file: Path, snippet_files: list[Path]):
    settings = {}
    had_file = target_file.exists()

    if had_file:
        try:
            settings = json.loads(target_file.read_text(encoding="utf-8"))
        except Exception as e:
            sys.stderr.write(f"Error: {target_file} is not valid JSON ({e}). Left untouched.\n")
            sys.exit(2)

    hooks_section = settings.setdefault("hooks", {})
    changes_made = False

    for s_file in snippet_files:
        if not s_file.exists():
            continue
        try:
            snippet = json.loads(s_file.read_text(encoding="utf-8"))
        except Exception as e:
            sys.stderr.write(f"Warning: Snippet {s_file} invalid JSON: {e}\n")
            continue

        for event_name, hook_list in snippet.get("hooks", {}).items():
            existing_event = hooks_section.setdefault(event_name, [])
            for new_hook in hook_list:
                # Match on matcher + command
                already_there = any(
                    h.get("matcher") == new_hook.get("matcher")
                    and h.get("command") == new_hook.get("command")
                    for h in existing_event
                )
                if not already_there:
                    existing_event.append(new_hook)
                    changes_made = True

    if changes_made:
        if had_file:
            backup_path = target_file.with_suffix(".json.bak")
            shutil.copyfile(target_file, backup_path)
        target_file.parent.mkdir(parents=True, exist_ok=True)
        target_file.write_text(json.dumps(settings, indent=2) + "\n", encoding="utf-8")
        print("updated")
    else:
        print("already present")


def main():
    if len(sys.argv) < 3:
        print("Usage: tsgf-settings.py hooks <target-settings.json> <snippet1.json> ...", file=sys.stderr)
        sys.exit(64)

    cmd = sys.argv[1]
    if cmd == "hooks":
        target = Path(sys.argv[2])
        snippets = [Path(p) for p in sys.argv[3:]]
        merge_hooks(target, snippets)
    else:
        print(f"Unknown command: {cmd}", file=sys.stderr)
        sys.exit(64)


if __name__ == "__main__":
    main()
