---
'@mizunagara/tokens': patch
'@mizunagara/css': patch
---

Theme scopes now set `color-scheme`: the dark theme sets `dark` and the root sets `light`. Native form controls and scrollbars inside a dark theme now render dark without extra CSS. Nothing changes for pages that never set a dark theme.
