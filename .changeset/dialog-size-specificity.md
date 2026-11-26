---
'@mizunagara/css': patch
---

Dialog width now comes from a `--mizu-dialog-max-width` custom property read by a zero-specificity rule. A consumer `max-w-*` class therefore wins over `size` without `!important`, in any stylesheet order. The default widths for each size are unchanged.
