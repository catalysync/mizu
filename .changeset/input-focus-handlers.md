---
'@mizunagara/react': patch
---

Fix `Input` with `maxCharacters`: a consumer `onFocus` or `onBlur` no longer stops the character counter's live region from switching to polite on focus and off on blur.
