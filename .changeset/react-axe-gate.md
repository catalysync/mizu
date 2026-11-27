---
'@mizunagara/react': patch
---

Adds `pnpm check:axe`, which fails when a component directory has no vitest-axe assertion. It runs as the first step of `pnpm test`. No runtime or API change for consumers.
