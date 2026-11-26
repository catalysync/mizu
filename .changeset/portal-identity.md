---
'@mizunagara/react': patch
---

Overlays now keep the identity they were opened from. Modal, Sheet, Drawer, AlertDialog, Popover, Tooltip, HoverCard, Select, DropdownMenu, ContextMenu and Combobox copy `data-mizu-identity`, `data-mizu-density` and `data-theme` onto their portalled content, so identity token overrides apply inside them. This is not breaking; without an identity ancestor nothing is added.
