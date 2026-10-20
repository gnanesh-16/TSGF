# TSGF Onboarding Guide

The 8-step onboarding flow for configuring a project with TSGF:

1. **Prerequisite Checks**: Inspects `git`, `python3`, `gh`, `jq`, and `node`.
2. **GitHub Repository & Auth**: Verifies connection to GitHub remote and `gh` authentication.
3. **Kanban Board Linking**: Connects or creates the 7-column project board (`Backlog`, `Ready`, `Building`, `QA`, `Review`, `Done`, `Blocked`).
4. **Branch Protection**: Configures `guard-protected-push.py` to block unauthorized direct pushes to `main`.
5. **Safety Guards**: Merges `hooks/settings-snippet.json` into `.claude/settings.json`.
6. **Verification Commands**: Queries user or detects `verify_commands` (e.g. `npm test`, `pytest`) saved to `.claude/tsgf/config.json`.
7. **AGENTS.md Setup**: Inserts or updates the managed `<!-- tsgf:begin -->` guidelines block.
8. **Initial Baseline Verification**: Runs a dry-run preflight check and reports readiness.
