# TSGF Board Status Reference

The `/tsgf status` command provides an instantaneous, read-only inspection of the Kanban board without triggering any background work or altering card positions.

## Usage
```bash
/tsgf status
/tsgf status --json
```

## Columns Reported
- 📥 **Backlog**: Idle ideas, automated findings, and bug reports.
- ✅ **Ready**: Approved tasks queued for next wave.
- 🔨 **Building**: Active workers writing minimal code diffs in worktrees.
- 🔍 **QA**: Active verification against Acceptance Criteria.
- 🧐 **Review**: Independent adversarial code review.
- 🎉 **Done**: Merged and verified tasks.
- 🙋 **Blocked**: Stalled tasks requiring human input.
