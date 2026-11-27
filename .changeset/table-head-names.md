---
'@mizunagara/react': minor
---

**Breaking:** `TableHeader` is now the `<thead>` section and `TableHead` is the `<th>` cell, matching the names most React table APIs use. They were reversed, so code written with the common names rendered a `<th>` where a `<thead>` was meant.

Migrate by swapping the two names: `<TableHead>` around rows becomes `<TableHeader>`, and `<TableHeader>` cells become `<TableHead>`. React's DOM-nesting warnings in development point at any usage that was missed.
