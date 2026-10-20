# Block Template: 🙋 Needs You

When a card cannot proceed autonomously—such as when the merge gate exits with code 7 (sensitive policy: payments, authentication, destructive database schema, or >400 lines) or code 8 (manual database migration or external human action required)—the card is moved to **`Blocked`** and this template is posted as an issue comment.

---

## Template Markdown

```markdown
🙋 **Your Turn on #<issue-number>**

TSGF reached a required human-approval checkpoint on PR #<pr-number>.

### Reason for Halt
- **Trigger**: `<policy-violation-or-manual-step>` (Exit `<code: 7 or 8>`)
- **Summary**: `<concise description of what needs human review or action>`

### Required Action Items
- [ ] Review sensitive changes: `<path/to/sensitive/file>`
- [ ] Run required manual migration or credential step:
  ```bash
  <command-to-run-locally>
  ```
- [ ] Approve and merge PR #<pr-number> manually, OR
- [ ] Leave comment `done` on this issue (or label `needs-you:done`) to resume the autonomous loop.

---
*TSGF paused worker lane for issue #<issue-number>. Other independent wave cards continue processing.*
```
