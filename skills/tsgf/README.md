# `/tsgf` — Orchestrator Skill

The orchestrator plans execution waves, routes cards according to labels, monitors lane workers, and applies the merge gate when reviews pass.

## Commands

```bash
/tsgf onboard          # 8-step setup & verification
/tsgf lint             # Audits Acceptance Criteria on Ready cards
/tsgf status           # Read-only snapshot of all 7 columns
/tsgf run <slug>       # Drains the Ready column into merged PRs
/tsgf stop             # Halts all active workers cleanly
```

## References
- [run-workflow.md](references/run-workflow.md): Step-by-step dispatch loop.
- [writing-standard.md](references/writing-standard.md): Standard formatting rules.
- [rate-limit-etiquette.md](references/rate-limit-etiquette.md): Rate limit management.
- [status.md](references/status.md): Snapshot reader details.
