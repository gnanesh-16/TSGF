#!/usr/bin/env python3
"""TSGF: tsgf-skills-ready.py
Verifies that all required lane skills (tsgf-build, tsgf-qa, tsgf-review)
exist with valid, nonempty SKILL.md definitions before dispatch.
"""

import json
import sys
from pathlib import Path

REQUIRED_LANE_SKILLS = ["tsgf-build", "tsgf-qa", "tsgf-review"]


def check_skills(root: Path) -> tuple[bool, list[str]]:
    missing = []
    candidates = [
        root / ".agents" / "skills",
        root / ".claude" / "skills",
        root / "skills",
    ]

    for skill in REQUIRED_LANE_SKILLS:
        found = False
        for c in candidates:
            skill_md = c / skill / "SKILL.md"
            if skill_md.exists() and skill_md.stat().st_size > 0:
                found = True
                break
        if not found:
            missing.append(skill)

    return (len(missing) == 0), missing


def main():
    root = Path.cwd()
    ok, missing = check_skills(root)
    if not ok:
        print(f"❌ Missing required lane skills: {', '.join(missing)}", file=sys.stderr)
        print("   Run `tsgf onboard` to restore missing skills.", file=sys.stderr)
        sys.exit(1)

    print("✓ All required lane skills are ready.")
    sys.exit(0)


if __name__ == "__main__":
    main()
