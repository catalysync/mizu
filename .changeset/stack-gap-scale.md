---
'@mizunagara/react': minor
---

`Stack` `gap` now takes a step from the spacing scale (`'none'`, `'1'` to `'6'`, `'8'`, `'10'`, `'12'`, `'16'`, `'20'`, `'24'`) instead of any CSS string. This is breaking for TypeScript users: `gap="1rem"` no longer compiles, so write `gap="4"` (`'1'` is 0.25rem). The rendered values for the scale steps are unchanged.
