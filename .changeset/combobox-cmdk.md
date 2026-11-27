---
'@mizunagara/react': minor
'@mizunagara/css': minor
---

rebuild Combobox on cmdk. The field is now a text input with `role="combobox"`, so it takes the Field label, arrow keys move the active option through `aria-activedescendant`, and the button-in-button markup is gone. Props are unchanged, but the DOM and CSS are not: the trigger button, `.mizu-combobox__trigger`, `.mizu-combobox__placeholder`, `.mizu-combobox__search` and its input were removed. On options, `data-selected` now marks the highlighted option (it used to mark the chosen one) and `aria-checked` marks the chosen one; code that styles or reads these needs updating.
