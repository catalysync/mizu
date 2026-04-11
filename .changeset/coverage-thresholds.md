---
'@aspect/react': patch
'@aspect/finance': patch
---

add vitest coverage config + thresholds. `@aspect/react` baseline: 75/79/59/75 statements/branches/functions/lines → thresholds 70/70/50/70. `@aspect/finance` baseline: 88/86/63/88 → thresholds 80/80/55/80. Run via `pnpm test:coverage` in each package. Thresholds are set below baseline to prevent regression; raise as coverage improves. Also fixes the test-setup type merge so `toBeInTheDocument`, `toHaveClass`, `toHaveAttribute` etc. are recognized during typecheck.
