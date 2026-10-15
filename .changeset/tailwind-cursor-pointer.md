---
'@mizunagara/tailwind-preset': patch
---

Restore `cursor: pointer` on enabled buttons and `[role="button"]` elements. Tailwind v4's preflight dropped it, so every button in a Tailwind + mizu app showed the arrow cursor. The rule sits in `@layer base`, so utilities such as `cursor-wait` still win, and disabled buttons keep the default cursor.
