---
'@aspect/css': patch
---

Reorder z-index scale so portal-rendered overlays sit above dialogs and drawers. Previously `--mizu-z-dropdown: 100` was below `--mizu-z-modal: 1200`, causing every `Select` / `DropdownMenu` triggered inside a modal to render _behind_ the modal. New order: overlay (1000) → drawer (1100) → modal (1200) → dropdown (1300) → popover (1400) → hover-card (1450) → tooltip (1500) → toast (1600). Added `--mizu-z-hover-card` token; previously hover cards collided with popovers at the same z-index.
