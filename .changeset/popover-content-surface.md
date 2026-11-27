---
'@mizunagara/css': patch
---

Give the `mizu-popover-content` wrapper a surface background, radius and stacking order. DatePicker and DateRangePicker panels were transparent and could render behind page content; consumers that overrode the popover selectors can drop those overrides.
