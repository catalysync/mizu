---
'@mizunagara/css': patch
---

ToggleGroup no longer clips the focus ring of its outer items. The group drops `overflow: hidden`, and the first and last items take over its rounded corners so hover and selected backgrounds stay inside the border.
