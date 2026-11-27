---
'@mizunagara/css': patch
---

Dialog width now comes from a `--mizu-dialog-max-width` custom property, which consumers can set. The size rule has zero specificity, so a `max-w-*` class on an unlayered stylesheet overrides `size` without `!important`. Default widths for each size are unchanged.
