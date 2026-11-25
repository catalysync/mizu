---
'@mizunagara/tokens': minor
'@mizunagara/css': minor
'@mizunagara/tailwind-preset': minor
'@mizunagara/react': minor
---

0.2.0 fixes how mizu is packaged. It is not 1.0, and it is not a claim that mizu is ready for production.

**What changed in packaging:**

- Internal peer ranges are satisfiable with the packages in this release, so a fresh install of the packed tarballs has no peer warning.
- `@mizunagara/react` types resolve for CommonJS consumers (`require` now points at `.d.cts`).
- `@mizunagara/react` has one subpath per component, mirroring `@mizunagara/css/components/*`, for example `@mizunagara/react/button`. The root import still works.
- `@mizunagara/tailwind-preset/legacy` loads as CommonJS from a `.cjs` file. The import path did not change.
- Every client chunk in the React build carries `"use client"`, not only the two index bundles.
- The CSS build fails when a `var(--mizu-*)` reference has no definition and no fallback.
- A tree-shaking check fails if a button-only import pulls in other components' source.
- CI runs the export-shape gate (publint and attw on each packed package) and a packed-tarball install of the core packages.

**Scope:** this note covers packaging only. The component and token changes from the other pending changesets ship in the same 0.2.0 release and are described in their own entries. Mizu still ships with the limits described in the README, and the trade-offs there still apply.
