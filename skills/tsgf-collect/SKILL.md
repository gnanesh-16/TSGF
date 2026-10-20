---
name: tsgf-collect
description: Autonomous problem collector. Discovers issues in Sentry, PostHog, GitHub issues, and PR patterns, then files verified Backlog cards.
---

# `/tsgf-collect` — Problem & Issue Collector

`/tsgf-collect` proactively discovers bugs, user drop-offs, and architectural gaps, turning telemetry and feedback into actionable, structured Backlog cards.

## Sources

```bash
/tsgf-collect sentry          # Scans Sentry error events & triage unhandled exceptions
/tsgf-collect posthog         # Scans PostHog analytics for conversion funnel drop-offs
/tsgf-collect issues          # Audits open GitHub issues, deduplicating & structuring
/tsgf-collect prs             # Scans recent merged PRs for recurring patterns or test gaps
/tsgf-collect architecture    # Audits codebase for technical debt and coupling
```

## Standard Ticket Generation

Every card filed by `/tsgf-collect` follows the TSGF Ticket Standard:
- **Problem**: Clear statement of the bug, gap, or friction.
- **Context**: Frequency, stack trace, impacted user routes, or metrics.
- **Fix**: Proposed engineering approach.
- **Acceptance Criteria**: Verifiable checklist items for QA.
- **Risk**: Regression risk assessment.
- **Blocked By**: Any prerequisite tasks.
- **Evidence**: Raw logs, payload snippet, or telemetry screenshot.
