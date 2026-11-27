---
'@mizunagara/react': minor
'@mizunagara/css': patch
---

Pagination gains a `labels` prop for translating the navigation landmark, previous, next and page-button names. `totalPages={0}` now renders no page buttons instead of a page 1, the current page uses the on-primary text token instead of a hard-coded white, and hovering the current page no longer washes out its highlight.
