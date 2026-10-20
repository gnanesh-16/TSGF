#!/usr/bin/env python3
"""TSGF: tsgf-agents-md.py
Refreshes or creates the managed <!-- tsgf:begin --> block in target AGENTS.md,
leaving anything outside the markers untouched.
"""

import argparse
import re
import sys
from pathlib import Path

DEFAULT_BLOCK = """<!-- tsgf:begin v{version} -->
# TSGF Framework Core Guidelines

This project uses **TSGF** (Task & Software Generation Framework) to manage autonomous development workflows.
See [CLAUDE.md](file://{root}/CLAUDE.md) for complete architecture, lane worker disciplines, and writing standards.

### Fast Rules
- **Orchestrator Mode**: When invoked with `/tsgf run`, coordinate card waves and worker lanes. Never implement code or write draft PRs in the primary orchestrator session.
- **Worker Mode**: When acting as a lane worker (`tsgf-build`, `tsgf-qa`, `tsgf-review`), always work inside an isolated worktree under `.claude/worktrees/` or `.agents/worktrees/`.
- **Safety First**: Respect all guard hooks in `hooks/`. Never attempt to bypass branch protections, leak credential files, or delete files outside the repository.
- **Evidence-Based Delivery**: Provide concrete test runs or visual screenshots before requesting review or merge.
<!-- tsgf:end -->"""


def sync_agents_md(root_dir: Path, version: str):
    agents_file = root_dir / "AGENTS.md"
    content = ""
    had_file = agents_file.exists()
    if had_file:
        content = agents_file.read_text(encoding="utf-8")

    block_text = DEFAULT_BLOCK.format(version=version, root=root_dir.as_posix())
    pattern = r"<!-- tsgf:begin.*?-->.*?<!-- tsgf:end -->"

    if re.search(pattern, content, re.DOTALL):
        updated = re.sub(pattern, block_text, content, flags=re.DOTALL)
    elif content.strip():
        updated = content.rstrip() + "\n\n" + block_text + "\n"
    else:
        updated = block_text + "\n"

    agents_file.write_text(updated, encoding="utf-8")
    print(f"✓ Synchronized AGENTS.md managed block (v{version})")


def main():
    parser = argparse.ArgumentParser(description="TSGF AGENTS.md Manager")
    parser.add_argument("--root", default=".", help="Project root directory")
    parser.add_argument("--version", default="1.0.0", help="TSGF version string")
    args = parser.parse_args()

    sync_agents_md(Path(args.root).resolve(), args.version)


if __name__ == "__main__":
    main()
