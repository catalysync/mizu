---
'@aspect/react': patch
'@aspect/finance': patch
'@aspect/css': patch
---

add sage-inspired ESLint plugins: `eslint-plugin-ssr-friendly`, `eslint-plugin-no-unsanitized`, `eslint-plugin-testing-library`, `eslint-plugin-jest-dom`. Tests now use `toBeInTheDocument`, `toHaveClass`, `toHaveAttribute`, `toHaveStyle`, and `toBeEnabled` matchers consistently. CSS components migrate off deprecated `clip: rect(...)` to `clip-path: inset(50%)`, off duplicate `appearance` declarations, and re-order selectors to comply with `no-descending-specificity`.
