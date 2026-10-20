# TSGF Wave Execution Workflow

This document details the orchestrator wave loop when invoked with `/tsgf run`.

## The Wave Loop

```
1. PREFLIGHT
   Check git clean, verify gh auth status, check lockfiles.
   
2. PLAN WAVE
   Execute `tsgf-wave-plan.sh`. Group ready cards with met dependencies into Wave 1..N.
   Route labels: `qa` skips Building lane.
   
3. DISPATCH WORKERS (Parallel or Staggered)
   For each task in the active wave:
     a. Assign card on board -> Move to `Building` (or `QA`).
     b. Worker runs in isolated worktree `.claude/worktrees/<card_id>`.
     c. Record lock in `.claude/tsgf/inflight/<card_id>.lock`.

4. LANE TRANSITIONS
     • Building -> QA (Draft PR opened with AC).
     • QA -> Review (Acceptance criteria verified, test proof attached).
       [Bounce]: If QA fails, card moves back to `Building` with failure log.
     • Review -> Done (Adversarial review green, merge gate passes).
       [Bounce]: If Review rejects, card moves back to `Building` with diff comments.

5. MERGE & CLEANUP
   Run `tsgf-merge-gate.sh <pr_number>`.
   Prune worktree via `cleanup-wt.py`.
   Move card to `Done`.

6. REPEAT FOR NEXT WAVE
   Once all tasks in current wave conclude, repeat from step 2 until Ready is empty.
```
