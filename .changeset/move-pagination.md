---
'@mizunagara/react': minor
'@mizunagara/css': minor
'@mizunagara/commerce': major
---

move Pagination from `@mizunagara/commerce` to `@mizunagara/react` — pagination is a base primitive, not commerce-specific. The new `@mizunagara/react` Pagination also supports numbered page buttons with `page`/`totalPages`/`onPageChange`/`siblingCount`, ellipsis collapsing for long ranges, and auto-computed hasPrevious/hasNext from page state. Breaking change for `@mizunagara/commerce` consumers — update imports from `@mizunagara/commerce` to `@mizunagara/react`.
