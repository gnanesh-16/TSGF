# TSGF Rate Limit Discipline

All lane workers and orchestrators share a common GitHub token budget. Strict discipline prevents quota starvation.

## The Rules
1. **Source the Guard**: Sourced `.claude/bin/tsgf-gh-guard.sh` before any batch operations.
2. **Batch & Cache**: Avoid polling GitHub in loops. Use local git commands (`git log`, `git blame`, `git branch`) for static history.
3. **Cap Adversarial Sub-Agents**: Any sub-agent making repetitive review or exploration calls is hard-capped at 50 `gh` calls.
4. **Graceful Exhaustion**: If quota drops below 100 requests, exit with code 79 and state:
   ```text
   confidence: insufficient_data
   ```
5. **Report Telemetry**: Always log remaining quota on PR comments:
   ```text
   gh-quota-on-exit: graphql=<n>/5000 rest=<n>/5000
   ```
