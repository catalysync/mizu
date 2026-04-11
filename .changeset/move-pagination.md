---
'@aspect/react': minor
'@aspect/css': minor
'@aspect/commerce': major
---

move Pagination from `@aspect/commerce` to `@aspect/react` — pagination is a base primitive, not commerce-specific. The new `@aspect/react` Pagination also supports numbered page buttons with `page`/`totalPages`/`onPageChange`/`siblingCount`, ellipsis collapsing for long ranges, and auto-computed hasPrevious/hasNext from page state. Breaking change for `@aspect/commerce` consumers — update imports from `@aspect/commerce` to `@aspect/react`.
