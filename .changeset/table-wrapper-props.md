---
'@mizunagara/react': minor
---

**Breaking:** `Table` now applies `className`, `style` and `ref` to its scroll wrapper `div` instead of the `<table>`. Table-level attributes such as `id` and `aria-label` still go to the table. `bordered`, `striped` and `stickyFirstColumn` are new props that replace hand-added modifier classes.
