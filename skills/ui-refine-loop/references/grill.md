# UI Refine Loop: Grilling Guide

Before executing unattended check-then-fix rounds on a frontend page or component, the agent asks at most **10 targeted design questions** to record user taste and direction.

## Grilling Principles
1. **Target Inspection First**: Read component markup, CSS tokens, and theme configs before asking questions.
2. **Batch Questions**: Ask in waves of 3 to 4 questions.
3. **Always Include Recommended Answer**: Formulate questions with a recommended default choice first.
4. **Output Destination**: Save final direction into `docs/design/taste.md`.

## Standard Question Dimensions
1. **Visual Tone**: Minimal / Calmer vs Bolder / Expressive.
2. **Information Density**: Compact high-density data tables vs Spacious editorial layouts.
3. **Color Strategy**: Strict monochrome with semantic accent vs Rich multi-hue palette.
4. **Motion & Feedback**: Subtle micro-transitions (150ms) vs Dynamic spring physics.
