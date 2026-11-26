---
'@mizunagara/react': minor
'@mizunagara/css': minor
---

Badge now exposes `--mizu-badge-bg`, `--mizu-badge-fg` and `--mizu-badge-border` as overrides, each falling back to its tone colour. The `md` size is set explicitly on every badge, and `count` badges take a `label` prop that becomes part of their accessible name (e.g. "3 unread messages"). A new `appearance="dot"` renders a solid status marker, with children kept as screen-reader text. Existing `tone`, `dot` and `count` usage is unchanged; the only DOM difference is that `data-size="md"` is now always present.
