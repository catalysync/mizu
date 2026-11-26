---
'@mizunagara/react': minor
'@mizunagara/css': minor
---

`Avatar` no longer throws when it gets no `src`, `initials` or children. It renders a placeholder icon instead. A failed image now falls back to initials, then children, then the icon. In development, passing `src` without `alt` logs a warning. Pass `alt=""` for decorative images.
