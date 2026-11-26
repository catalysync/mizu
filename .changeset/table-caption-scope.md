---
'@mizunagara/react': minor
---

`Table` takes a `caption` prop that renders as the table's `<caption>`, so accessible names no longer need a separate `TableCaption` child. `TableHead` cells now default to `scope="col"`; pass `scope="row"` for row headers.
