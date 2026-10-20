# Builder Decision Policy & PR Cap

This policy guides the `tsgf-build` lane worker to deliver safe, high-velocity code increments.

## The Cardinal Rules

### 1. The 400-Line PR Diff Cap
- Every pull request must remain under **400 changed lines** (excluding lockfiles, generated assets, snapshots, and migration SQL).
- If an implementation expands beyond 400 lines during building:
  1. **Stop immediately**.
  2. Do not attempt to complete the full scope in a massive PR.
  3. Revert unfinished files and deliver a functional vertical slice.
  4. File follow-up tracer-bullet cards for the remaining scope.

### 2. Test-Driven Development (TDD) Ladder
Before writing implementation code:
1. Identify the public interface or seam.
2. Write a failing test proving the requirement (`red`).
3. Write the minimal code required to satisfy the test (`green`).
4. Refactor under passing test coverage (`refactor`).

### 3. Worktree Cleanliness
- All code changes must occur inside `.claude/worktrees/<id>` or `.agents/worktrees/<id>`.
- Never pollute the root workspace with temporary artifacts or debug logs.
- Run local verify commands inside the worktree before creating the draft PR.
