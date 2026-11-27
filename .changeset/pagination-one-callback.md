---
'@mizunagara/react': minor
---

Pagination's previous and next buttons now fire exactly one callback per click. `onPrevious` and `onNext` are called when provided, and `onPageChange` is used only when they are not. Previously a click called both, so this is a breaking change for consumers that relied on `onPageChange` firing alongside `onPrevious` or `onNext`.
