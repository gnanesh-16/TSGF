# `tsgf-build` (Building Lane)

Autonomous worker lane responsible for translating task requirements into verified code changes within an isolated worktree.

## Core Lifecycle
1. Creates worktree: `git worktree add .claude/worktrees/<id> -b tsgf/<id>-feat`
2. Reads card AC and writes minimal required diff
3. Runs project test suites
4. Initializes and populates PR body via `tsgf-pr-body.sh`
5. Moves card to `QA`
