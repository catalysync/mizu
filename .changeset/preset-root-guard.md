---
'@mizunagara/tailwind-preset': patch
---

The Tailwind bridge's `:root` output stays limited to the `@theme` theme keys, so component-level variables are never declared on `:root`. This adds a test that fails if that changes; the generated CSS is unchanged.
