---
'@mizunagara/react': minor
---

**Breaking:** `Table` now applies `className`, `style` and `ref` to its scroll wrapper `div` instead of the `<table>`. The ref type is now `HTMLDivElement`, so `useRef<HTMLTableElement>` needs updating. Table-level attributes such as `id` and `aria-label` still go to the table. Any `mizu-table--*` modifier classes passed through `className` now land on the wrapper and stop working; use the new `bordered`, `striped` and `stickyFirstColumn` props instead.
