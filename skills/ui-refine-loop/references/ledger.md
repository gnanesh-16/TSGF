# Refine Round Memory Ledger

Tracks problem IDs, quality scores (/40), and applied fix verbs across iterative rounds.

## Entry Schema
```markdown
| Round | Score /40 | Critique (UX /20) | Audit (Tech /20) | Applied Verbs | Status |
|-------|-----------|-------------------|------------------|---------------|--------|
| R0    | 24/40     | 12/20             | 12/20            | initial       | Red    |
| R1    | 32/40     | 16/20             | 16/20            | layout, typeset| Better |
| R2    | 38/40     | 19/20             | 19/20            | polish        | Clean  |
```

## Halting Rules
- **Stop Condition 1**: Two consecutive rounds with zero P0/P1 defects and score ≥ 36/40.
- **Stop Condition 2**: Two reverted rounds in succession (quality regression).
- **Stop Condition 3**: Maximum 5 rounds reached.
