# `tsgf-review` (Review Lane)

Autonomous review lane that acts as a gatekeeper, testing hypotheses, remembering past anti-patterns, and executing the automated merge gate.

## Responsibilities
- Generates independent adversarial failure hypotheses
- Audits diff against `.claude/tsgf/review-memory.json`
- Evaluates `tsgf-merge-policy.py`
- Bounces back to `Building` on review concerns
- Triggers `tsgf-merge-gate.sh` on approval and moves card to `Done`
