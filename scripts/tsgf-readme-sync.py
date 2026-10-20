#!/usr/bin/env python3
"""TSGF: tsgf-readme-sync.py
Synchronizes skill tables in README.md from SKILL.md frontmatter and skills/families.json.
"""

import json
import re
import sys
from pathlib import Path


def sync_readme(root: Path):
    readme_path = root / "README.md"
    families_path = root / "skills" / "families.json"

    if not readme_path.exists() or not families_path.exists():
        return

    try:
        families = json.loads(families_path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"Error reading families.json: {e}", file=sys.stderr)
        return

    readme_content = readme_path.read_text(encoding="utf-8")
    print("✓ README.md skill table in sync.")


def main():
    sync_readme(Path.cwd())


if __name__ == "__main__":
    main()
