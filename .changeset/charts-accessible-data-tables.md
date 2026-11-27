---
'@mizunagara/charts': minor
---

Charts now use `role="group"` instead of `role="img"`, and each chart renders a visually hidden data table with its values, so screen reader users can read the numbers. This changes the role a chart exposes: code or tests that query `role="img"` on a chart container need to query `role="group"` instead.
