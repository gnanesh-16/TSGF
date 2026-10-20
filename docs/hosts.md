# TSGF Supported Agent Runtimes & Hosts

TSGF is designed from the ground up as a **universal autonomous software factory**, providing first-class support across modern agent environments.

---

## 🌟 1. Google Antigravity (Primary Supported Host)

**Google Antigravity (AGY)** is the flagship runtime for TSGF.

### Integration Mechanism
- **Customization Roots**: TSGF skills, rules, and workflows reside in `.agents/skills/` and `.agents/rules/` within the repository workspace.
- **Sidecar & Slash Commands**:
  - `/tsgf` routes directly to the master orchestrator.
  - `/tsgf-collect` routes to telemetry signal mining.
  - `/ui-refine-loop` triggers the interactive design critique-and-fix sub-agents.
  - `/visual` produces standalone HTML recaps.
- **Native Browser Subagents**: `tsgf-qa` leverages Google Antigravity's native `browser_subagent` and Chrome DevTools MCP tools for automated UI verification and headless visual regression capturing.
- **Deterministic Worktrees**: Antigravity sessions respect all sandbox hooks in `hooks/guard-worktree-path.py` and `guard-delete-outside.py`.

---

## 2. Claude Code

- Uses `.claude/skills/` and `.claude/settings.json`.
- Guard hooks are registered in `PreToolUse` and `PostToolUse` via `settings-snippet.json`.
- Wave runner dispatches sub-agents using `workflows/tsgf-wave.js`.

---

## 3. OpenAI Codex & Cursor

- Shared `.agents/` directory functions as the single source of truth.
- Script engine (`scripts/tsgf-wave-plan.py`, `scripts/tsgf-merge-gate.sh`) can be driven via terminal or custom tool wrappers.
- Guard hooks run as pre-commit and pre-execution boundaries.
