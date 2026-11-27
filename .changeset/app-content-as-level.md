---
'@mizunagara/react': minor
---

`AppContent` takes an `as` prop (`main`, `div`, `section` or `article`; default `main`) so apps that already provide a main landmark can avoid a nested one. `AppContentHeader` takes a `level` prop (1 to 6, default 1) to set the title heading level.

Breaking: the `cards` and `wizard` values were removed from `AppContentType` because they had no styles. Use `default` or another supported type instead.
