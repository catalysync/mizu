---
'@mizunagara/react': minor
---

Adds `useCommandMenuShortcut`, which toggles a `CommandMenu` on Cmd+K (or Ctrl+K) and takes an `enabled` flag to turn the shortcut off. `CommandMenu` now gives its dialog a visually hidden title, so screen readers announce it as "Command menu". This change is not breaking.
