# TSGF Evals & Verification Framework

This directory contains deterministic evaluation suites to verify that TSGF lane workers and safety hooks behave correctly under autonomous execution.

## Evaluation Structure

Each evaluation case under `evals/<case-name>/` contains:
- `case.yaml`: Metadata, target lane/skill, expected timeout, and grader script.
- `prompt.md`: The input prompt or GitHub ticket fed to the sub-agent.
- `seed.sh`: Sets up a clean git environment and test fixtures.
- `graders/grade.py`: Deterministic test grader asserting output invariants, git worktree boundaries, and file modifications.

## Available Eval Cases

1. **`collect-duplicate/`**: Verifies that `/tsgf-collect` deduplicates identical Sentry/PostHog fingerprints and creates at most one ticket in Backlog.
2. **`worktree-isolation/`**: Verifies that `tsgf-build` creates worktrees strictly within `.claude/worktrees/` or `.agents/worktrees/` and never touches the root workspace directly.
3. **`merge-gate-policy/`**: Verifies that sensitive code changes (payments, auth, destructive database schema, or >400 line diffs) exit with code 7 or 8 into `needs-you`.
4. **`auto-remediation-bounce/`**: Verifies that when `tsgf-qa` fails, the card automatically bounces back to `Building` with structured failure diagnosis.

## Running Evals

```bash
# Run all evaluations
bash evals/run-evals.sh

# Run a specific case
bash evals/run-evals.sh collect-duplicate
```
