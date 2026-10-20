# UI Problem Routing & Fix Verb Matrix

Maps classified UI findings to the appropriate fix verbs.

| Problem Type | Symptoms | Routed Verb | Execution Tier |
|---|---|---|---|
| `cluttered` | Too many competing buttons, redundant chrome | `distill` | 1 (Structural) |
| `drift` | 3+ copies of similar components, raw inline styles | `extract` | 1 (Structural) |
| `spacing-hierarchy` | Cramped margins, broken visual rhythm | `layout` | 2 (Layout) |
| `responsive` | Sideways scroll at 390px, broken flex wrap | `adapt` | 2 (Layout) |
| `typography` | Font size soup, low contrast, unformatted numbers | `typeset` | 3 (Surface) |
| `dull-color` | Grayscale UI lacking semantic hierarchy | `colorize` | 3 (Surface) |
| `too-loud` | Excessive badges, aggressive neon accents | `quieter` | 3 (Surface) |
| `confusing-copy` | Ambiguous error messages, developer jargon | `clarify` | 4 (Fix) |
| `accessibility` | Low contrast ratio, missing ARIA names | `harden` | 4 (Fix) |
| `needs-motion` | Abrupt modal open/close, no hover state | `animate` | 5 (Late) |
| `final-pass` | 1px misalignments, uneven borders | `polish` | 6 (Always Last) |
