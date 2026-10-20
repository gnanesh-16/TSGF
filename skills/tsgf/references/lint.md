# TSGF Ticket Readiness & Lint Standards

Before any card moves from `Backlog` into `Ready`, or before `/tsgf run` claims a batch of cards, `/tsgf lint` verifies that the card satisfies the **18 TSGF Readiness Criteria**.

## The 18 Readiness Criteria

### Phase 1: Core Mechanics
1. **Valid Markdown Structure**: The ticket body has valid Markdown headers.
2. **Explicit Title**: Title begins with a type tag (`[feat]`, `[bug]`, `[refactor]`, `[qa]`).
3. **Problem Statement**: Contains a `## Problem` section clearly articulating the defect or objective.
4. **Context & Preconditions**: Contains a `## Context` section describing starting state or prerequisites.
5. **Proposed Solution**: Contains a `## Solution` section outlining technical approach.
6. **Acceptance Criteria**: Contains a `## Acceptance Criteria` section with checkbox list (`- [ ]`).

### Phase 2: Autonomous Execution Safety
7. **Single Vertical Slice**: The task can be delivered in a single PR under the **400-line diff cap**.
8. **Dependencies Declared**: Any blockers are explicitly declared as `## Blocked by #<issue>`.
9. **No Circular Blocks**: Blockers do not introduce cyclical graph dependencies.
10. **Reproduction Proof (Bugs)**: Bug cards contain an explicit reproduction command or test case.
11. **Isolated Seam**: Touches a defined component or interface rather than full-codebase cross-cutting changes.
12. **No Ambiguous Placeholders**: Contains no "TBD", "TODO", or placeholder specifications.

### Phase 3: Verification & Policy Gates
13. **Verifiable ACs**: Every acceptance criterion is machine-verifiable with an automated test or screenshot.
14. **No Direct Production Credentials**: Explicitly requires mock tokens or test fixtures; never production secrets.
15. **Sensitive Policy Declaration**: Cards affecting billing, auth, or migrations are tagged for human merge approval.
16. **Visual Criteria (UI)**: UI changes require Before/After screenshots and responsive viewport verification.
17. **Clean Rollback Seam**: The change can be reverted via `git revert` without breaking unrelated functionality.
18. **Review Hypotheses Hint**: Highlights critical edge cases for Lane 3 Review verification.
