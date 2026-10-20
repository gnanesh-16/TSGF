# `tsgf-qa` (QA Lane)

Autonomous QA worker lane that enforces proof over claims by verifying Acceptance Criteria against running software.

## Responsibilities
- Pulls PR branch in worktree
- Runs full test suites + browser runtime validation
- Validates every item in the Acceptance Criteria checklist
- Attaches screenshot / log artifacts to PR body
- Bounces back to `Building` on failure; promotes to `Review` on pass
