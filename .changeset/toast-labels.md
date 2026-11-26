---
'@mizunagara/react': patch
---

`Toast` close buttons now have an accessible name ("Close") by default, taken from the locale, so icon-only dismiss buttons are announced without extra props. Passing `aria-label` still overrides it. The viewport landmark label is also set explicitly, and a `label` prop overrides it.
