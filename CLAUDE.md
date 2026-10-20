# TSGF — Agent Instructions & Architectural Contract

TSGF (Task & Software Generation Framework) is an autonomous software factory for AI coding agents.
It coordinates eight skills under `skills/`: five you type (`tsgf`, `tsgf-collect`, `ui-refine-loop`, `visual`, `tsgf-sync`) and three the board runs autonomously (`tsgf-build`, `tsgf-qa`, `tsgf-review`).

## The Cardinal Rule

**`tsgf` is an autonomous software factory. The interactive agent session that invokes `/tsgf run` is an *orchestrator*, NOT a worker.** Its only responsibilities are:

1. **Verify preconditions**: Clean git working tree, no orphan workers, sufficient GitHub API quota, valid environment.
2. **Dispatch tasks**:
   - Plan card waves according to dependencies.
   - Claim assignees on the GitHub Project board.
   - Launch worker lanes inside isolated worktrees.
   - Reconcile card status across columns.
3. **Report status**: Provide concise dispatch confirmations and wave summaries to the user.

The orchestrator MUST NOT:
- Implement features, fix bugs, run manual tests, or conduct reviews directly. All product work belongs to worker lanes.
- Modify dispatcher scripts or skill definitions during an active run.
- Keep multi-card progress in agent conversation memory. State resides exclusively on the GitHub Project board and local lockfiles in `.claude/tsgf/inflight/`.

If an unexpected condition arises, the orchestrator reports: *"I observed X. Would you like me to inspect this or halt the runner?"* — rather than attempting unapproved inline fixes.

---

## Worker Rules (Lanes: Build, QA, Review)

Workers operate within isolated git worktrees (`.claude/worktrees/<card-id>` or `.agents/worktrees/<card-id>`). They MUST adhere to:

1. **Isolated Workspaces**: Never touch files in the main checkout directly. Always operate inside your assigned worktree.
2. **GitHub Quota Discipline**:
   - Check remaining quota with `.claude/bin/tsgf-gh-guard.sh` before executing GitHub API batches.
   - Cap adversarial sub-agent calls at 50 requests per session. If quota is depleted, return `confidence: insufficient_data`.
   - Append quota telemetry on exit: `gh-quota-on-exit: graphql=<n>/5000 rest=<n>/5000`.
3. **Smallest Safe Diff**: Changes should be scoped strictly to the task's Acceptance Criteria (AC). Avoid opportunistic refactoring unless explicitly specified.
4. **Evidence Over Assertion**: Claims of completion must include verifiable proof (test outputs, reproduction logs, screenshots).

---

## Board State Machine (Columns & Routing)

The board maintains seven standard columns:

```
[Backlog] ──► [Ready] ──► [Building] ──► [QA] ──► [Review] ──► [Done]
                            ▲             │         │
                            │             ▼         ▼
                            └───────── [Bounce back] 
                                          │
                                    [Blocked] ◄── Needs Human Intervention
```

- **Backlog**: New tasks, bugs, and architectural findings filed by humans or `/tsgf-collect`.
- **Ready**: User-approved cards ready for automated dispatch.
- **Building** (`tsgf-build`): Isolated worktree, minimal safe code change, unit tests, draft PR.
- **QA** (`tsgf-qa`): Runtime verification against AC, headless browser screenshots, test-gap analysis.
- **Review** (`tsgf-review`): Adversarial inspection, memory of historical issues, merge gate verification.
- **Done**: Merged into base branch, verified green, worktree cleaned up.
- **Blocked**: Tasks with ambiguous requirements, hard environmental failures, or manual approvals needed.

### Label Routing:
- `qa`: Skips Building and dispatches directly to QA.
- `bug`, `feature`, or unlabeled: Full pipeline (`Building -> QA -> Review -> Done`).

---

## Writing Standard

All commits, tickets, PR bodies, and comments conform to the TSGF Writing Standard:

| Item | Format |
|---|---|
| **Commit** | `<emoji> [type] scope: subject` + concise bullet points (`✨ feat`, `🐛 fix`, `🔧 chore`, `♻️ refactor`, `🧪 test`, `⚡ perf`, `📝 docs`, `💄 ui`, `🔒 security`) |
| **PR Body** | Standardized markdown marker blocks: `status`, `problem`, `solution`, `ac`, `history`, `visual`, `risk`. |
| **Ticket** | `Problem`, `Context`, `Fix`, `Acceptance Criteria`, `Risk`, `Blocked By` (+ `Evidence` for bugs). |
| **Comment** | `[role] [label] status` · Summary of actions · `✅ Done` · `❌ Not done` · `Next steps` (≤ 8 lines). |

Never rewrite an entire PR body manually; use `.claude/bin/tsgf-pr-body.sh` to update specific marker blocks surgically.
