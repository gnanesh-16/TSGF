# TSGF Writing Standard

Consistency across commits, tickets, PR bodies, and review comments is mandatory for autonomous collaboration.

---

## 1. Commits

Format: `<emoji> [type] scope: subject` followed by concise bullet points.

- ✨ `feat`: New feature or user-facing capability
- 🐛 `fix`: Bug fix
- 🔧 `chore`: Tooling, build config, dependencies
- ♻️ `refactor`: Code reorganization without behavior change
- 🧪 `test`: Adding or updating test suites
- ⚡ `perf`: Performance improvement
- 📝 `docs`: Documentation updates
- 💄 `ui`: Visual styling or layout polish
- 🔒 `security`: Security patches or guard updates

### Example:
```text
✨ [feat] auth: add session renewal token endpoint

- Add /api/v1/auth/refresh endpoint
- Add unit tests for token expiration and rotation
- Update OpenAPI schema documentation
```

---

## 2. PR Body Format

PR bodies MUST use structured HTML comment marker blocks. Never rewrite the entire PR body; use `tsgf-pr-body.sh set <block>`:

```markdown
<!-- tsgf:status:begin -->
🟡 **Status:** In QA (32/32 tests green)
<!-- tsgf:status:end -->

### Problem
<!-- tsgf:problem:begin -->
Session expired errors occur prematurely during receipt uploads.
<!-- tsgf:problem:end -->

### Solution
<!-- tsgf:solution:begin -->
Implement background token refresh 60 seconds before JWT expiry.
<!-- tsgf:solution:end -->

### Acceptance Criteria
<!-- tsgf:ac:begin -->
- [x] Token refreshes automatically when < 60s remaining
- [x] Failed refresh redirects to /login gracefully
- [x] Unit and integration tests passing
<!-- tsgf:ac:end -->

### Visual Evidence
<!-- tsgf:visual:begin -->
![Upload proof](artifacts/screenshot-upload.png)
<!-- tsgf:visual:end -->

### Risk & Rollback
<!-- tsgf:risk:begin -->
Low risk. Revert commit cleanly if needed.
<!-- tsgf:risk:end -->

### Handoff History
<!-- tsgf:history:begin -->
- `tsgf-build`: worktree initialized, draft PR opened.
- `tsgf-qa`: 32/32 tests passing, visual proof attached.
<!-- tsgf:history:end -->
```

---

## 3. Comments

Comments posted to GitHub issues and PRs follow the concise 8-line rule:

```text
[tsgf-qa] [qa] passed
Did: Ran automated test suite and headless browser validation.
✅ Done: All 3 Acceptance Criteria verified with screenshots.
❌ Not done: None.
Next: Handing off to tsgf-review for merge gate evaluation.
gh-quota-on-exit: graphql=4920/5000 rest=4880/5000
```
