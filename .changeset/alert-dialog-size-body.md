---
'@mizunagara/react': minor
'@mizunagara/css': minor
---

`AlertDialogContent` takes a `size` prop (`sm`, `md` (default), `lg`, `xl`), and the new `AlertDialogBody` holds the main content between header and footer. The panel is capped at 85vh and the body scrolls, so long content no longer pushes the footer off screen. This is additive; existing dialogs keep their current look.
