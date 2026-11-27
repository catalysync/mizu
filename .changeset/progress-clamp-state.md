---
'@mizunagara/react': minor
'@mizunagara/css': minor
---

Progress clamps `value` to the 0 to `max` range, so out-of-range values no longer render as indeterminate, and an explicit `label` now takes precedence over `aria-label`. Adds a `valueText` prop for a custom screen-reader value. Breaking for CSS: the `.mizu-progress--indeterminate` class is replaced by `data-state="indeterminate"` on `.mizu-progress`, so update any selectors that targeted the class.
