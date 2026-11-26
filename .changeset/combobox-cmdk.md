---
'@mizunagara/react': minor
'@mizunagara/css': minor
---

rebuild Combobox on cmdk. The field is now a text input with `role="combobox"`, so it takes the Field label, arrow keys move the active option through `aria-activedescendant`, and the button-in-button markup is gone. Props are unchanged, but the DOM is not: the `.mizu-combobox__trigger` class and the search box inside the popover were removed, so code that styles or queries them needs updating.
