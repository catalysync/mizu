---
'@mizunagara/tokens': minor
'@mizunagara/css': patch
'@mizunagara/tailwind-preset': patch
---

Define the five tokens mizu's own CSS referenced but never defined, which made the affected properties fall back to their initial values (transparent backgrounds, black text, no border):

- `--mizu-border-subtle` (slate-100; slate-900 in dark)
- `--mizu-text-tertiary` (slate-500; slate-400 in dark, where slate-500 is below AA)
- `--mizu-surface-primary` (an alias of `--mizu-surface-default`)
- `--mizu-feedback-info-default` (blue-600), which only the sage theme defined, plus `--mizu-feedback-info-subtle` (blue-50) so the info family matches success, warning and danger
- query-builder now references `--mizu-font-line-height-normal` instead of the non-existent `--mizu-line-height-normal`

Also add `--mizu-surface-hover` and `--mizu-text-on-primary` (white in both modes, unlike `text-inverse`, which flips in dark), and map `info`/`info-subtle` in the Tailwind bridge. A new `@mizunagara/css` test suite fails on any `var(--mizu-*)` without a fallback that names an undefined token.
