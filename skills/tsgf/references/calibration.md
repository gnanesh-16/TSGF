# Post-Run Calibration & Continuous Learning

TSGF incorporates continuous learning between waves by calibrating skill prompts, review memory, and test gap ledgers after each wave completes.

## Calibration Triggers

1. **Repeated Review Bounces**: If a card bounces between Review and Building more than once, calibration updates `.claude/tsgf/review-memory.json` with the root cause smell.
2. **Test Gaps**: If QA discovers a defect missed by local unit tests, the test-gap ledger records the missing coverage layer.
3. **Flaky Command Detection**: If a verification command exits intermittently without code changes, the command is flagged for timeout and retry backoff.
