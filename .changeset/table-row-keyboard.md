---
'@mizunagara/react': minor
'@mizunagara/css': patch
---

Clickable `TableRow`s are now keyboard reachable: they get `tabIndex={0}`, Enter and Space call `onClick`, and a visible focus ring shows on focus. Pass the new `selectable` prop to expose `aria-selected` on a row. A caller's own `tabIndex` or `onKeyDown` still takes precedence.
