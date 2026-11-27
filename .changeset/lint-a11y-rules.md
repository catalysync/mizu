---
'@mizunagara/lint': minor
---

Adds three ESLint accessibility rules: `mizu/icon-button-label` (IconButton needs an `aria-label`), `mizu/aria-invalid-bound-style` (`aria-invalid` needs a matching `data-invalid` so the error is styled) and `mizu/no-static-click` (an `onClick` on a non-interactive element needs a `role`). The package is still private.
