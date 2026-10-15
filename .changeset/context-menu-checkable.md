---
'@mizunagara/react': minor
'@mizunagara/css': patch
---

Add `ContextMenuCheckboxItem` and `ContextMenuRadioItem`. `ContextMenuRadioGroup` was exported without an item to put in it, and `DropdownMenu` already had both. They render the same check and dot indicators as the dropdown menu, styled by the new `mizu-context-menu__item--checkable` and `mizu-context-menu__indicator` classes.
