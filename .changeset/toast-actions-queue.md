---
'@mizunagara/react': minor
'@mizunagara/css': minor
---

`Toast` accepts an `actions` prop, rendered as buttons in a row under the content. A new `toast()` function and `Toaster` component add an imperative queue: calling `toast()` with an existing `id` replaces that toast instead of adding a second one. Nothing existing changes, so this is additive and not breaking.
