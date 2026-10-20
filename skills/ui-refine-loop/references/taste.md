# Design Taste & Direction Reference

Default project taste guidelines for unattended UI refinement loops.

## Core Rules
- **Typography**: Single sans family (`Inter` or system-ui) + clean monospace (`JetBrains Mono` or `Geist Mono`).
- **Contrast**: Minimum 4.5:1 on text elements; WCAG AA compliance required in both light and dark modes.
- **Rhythm & Spacing**: 4px / 8px scale. Never use ad-hoc pixel values like `margin: 13px`.
- **Transitions**: 150ms to 200ms `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Borders & Shadows**: 1px subtle borders (`rgba(255,255,255,0.08)` dark / `rgba(0,0,0,0.08)` light) with soft elevated shadows.
