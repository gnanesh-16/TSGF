---
name: tsgf-sync
description: Safe git synchronizer. Creates atomic commits per logical change, merge-pulls upstream cleanly, and pushes without force.
---

# `/tsgf-sync` — Git Synchronization Skill

`/tsgf-sync` handles routine git discipline for developers and agents safely:
1. **Status Inspection**: Reviews modified files and stages logical chunks.
2. **Atomic Commits**: Generates commit messages conforming to the TSGF Commit Standard (`<emoji> [type] scope: subject`).
3. **Safe Pull**: Pulls remote changes using `git pull --rebase` or merge.
4. **Non-Force Push**: Verifies destination branch is not protected, then pushes cleanly without `--force`.
5. **Summary Report**: Prints short summary of commits pushed.
