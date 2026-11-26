---
'@mizunagara/react': patch
---

Fix `Input` with `maxCharacters`: the counter now starts from `defaultValue` or `value` instead of 0, and a controlled `value` changed by the parent updates the count.
