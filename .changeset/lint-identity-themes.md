---
'@mizunagara/lint': minor
---

Turns on the `mizu/identity-tokens-only` rule for `packages/css/src/themes`. The 21 identity themes still carry component selectors, which the rule reports as warnings until they are moved out. The package is still private.
