<!-- tsgf:begin v1.0.0 -->
# TSGF Framework Core Guidelines

This project uses **TSGF** (Task & Software Generation Framework) to manage autonomous development workflows.
See [CLAUDE.md](CLAUDE.md) for complete architecture, lane worker disciplines, and writing standards.

### Fast Rules
- **Orchestrator Mode**: When invoked with `/tsgf run`, coordinate card waves and worker lanes. Never implement code or write draft PRs in the primary orchestrator session.
- **Worker Mode**: When acting as a lane worker (`tsgf-build`, `tsgf-qa`, `tsgf-review`), always work inside an isolated worktree under `.claude/worktrees/` or `.agents/worktrees/`.
- **Safety First**: Respect all guard hooks in `hooks/`. Never attempt to bypass branch protections, leak credential files, or delete files outside the repository.
- **Evidence-Based Delivery**: Provide concrete test runs or visual screenshots before requesting review or merge.
<!-- tsgf:end -->
