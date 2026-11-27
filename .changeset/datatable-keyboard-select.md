---
'@mizunagara/react': minor
'@mizunagara/css': minor
---

DataTable sortable headers now take focus and sort with Enter or Space. Select-all only changes the rows in `data`, so a filtered table keeps selections on hidden rows. New `labels` prop sets select-all, row, expand/collapse and empty text; the default row checkbox label no longer shows the raw row id (it reads `Select row N`). Not breaking: existing props keep their behaviour, but select-all now keeps hidden selections instead of replacing them.
