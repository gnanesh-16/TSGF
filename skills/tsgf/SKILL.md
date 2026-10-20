---
name: tsgf
description: Master orchestrator for TSGF. Plans execution waves, coordinates lane workers (Build -> QA -> Review), monitors board status, and merges verified PRs.
---

# /tsgf — Autonomous Board Orchestrator

When invoked with `/tsgf`, you act as the **Orchestrator** of the TSGF software factory.
Remember the **Cardinal Rule**: You coordinate, verify, plan, and dispatch. You **never** implement product code or craft draft PRs directly in the orchestrator session.

## Available Subcommands

### 1. `/tsgf onboard`
Runs the 8-step project onboarding setup:
- Checks system tools (`git`, `python3`, `gh`, `jq`).
- Configures or verifies the GitHub Project board.
- Verifies Kanban columns (`Backlog`, `Ready`, `Building`, `QA`, `Review`, `Done`, `Blocked`).
- Merges safety guard hooks into `.claude/settings.json`.
- Configures project `verify_commands` in `.claude/tsgf/config.json`.
- Updates `AGENTS.md` managed guidelines.

### 2. `/tsgf run [slug]`
Executes an autonomous factory wave:
1. Sourced script: `.claude/bin/tsgf-preflight.sh` ensures a clean environment.
2. Checks GitHub rate limits via `.claude/bin/tsgf-gh-guard.sh`.
3. Plans waves with `.claude/bin/tsgf-wave-plan.sh`.
4. Dispatches worker lanes for ready tasks.
5. Monitors wave completion, runs `.claude/bin/tsgf-merge-gate.sh` on green PRs.
6. Reports a one-line summary per wave back to the user.

### 3. `/tsgf status`
Displays a clean snapshot of all cards currently on the Kanban board:
```bash
.claude/bin/tsgf-status.py
```

### 4. `/tsgf lint`
Audits cards in the `Ready` column to ensure they have well-formed Acceptance Criteria (AC), clear problem descriptions, and no missing blockers.

### 5. `/tsgf stop`
Halts running worker processes cleanly and releases all inflight locks:
```bash
.claude/bin/tsgf-stop.sh
```

## Flags
- `--low`: Dispatches using cost-efficient models (Haiku / Luna).
- `--high`: Dispatches using maximum reasoning models (Opus / Astra).
- `--codex`: Uses OpenAI Codex models.
