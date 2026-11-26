---
'@mizunagara/tokens': minor
---

Semantic surface, text, border and feedback colours now resolve with `light-dark()` in the tokens sheet, so a scope that sets `color-scheme: dark` gets the dark values without a `data-theme` attribute. Values under `[data-theme="dark"]` and the default light page are unchanged. One visible effect: an element with `color-scheme: dark` and no theme attribute now gets dark semantic colours where it used to get light ones.
