# @aspect/finance

## 0.2.0

### Minor Changes

- 1c78522: add 6 finance components for nagara-finance (Wave 4):
  - **CurrencyInput** — NumberInput preset with locale-aware currency symbol prefix and 2-decimal precision default
  - **TaxRateInput** — NumberInput preset with % suffix and 0-100 clamp
  - **InvoiceLineItem** — single-row line item composing description/qty/unit price/tax/computed total with inline remove
  - **LedgerRow** — debit/credit/balance row with negative balance styling and subtotal variant
  - **ChartOfAccounts** — recursive tree of accounts with code/name/type/balance and 4-level depth indent
  - **ReconciliationRow** — bank match row with matched/unmatched/disputed/pending status and optional match reference

### Patch Changes

- 0be060d: add vitest coverage config + thresholds. `@aspect/react` baseline: 75/79/59/75 statements/branches/functions/lines → thresholds 70/70/50/70. `@aspect/finance` baseline: 88/86/63/88 → thresholds 80/80/55/80. Run via `pnpm test:coverage` in each package. Thresholds are set below baseline to prevent regression; raise as coverage improves. Also fixes the test-setup type merge so `toBeInTheDocument`, `toHaveClass`, `toHaveAttribute` etc. are recognized during typecheck.
- 01f4d61: add sage-inspired ESLint plugins: `eslint-plugin-ssr-friendly`, `eslint-plugin-no-unsanitized`, `eslint-plugin-testing-library`, `eslint-plugin-jest-dom`. Tests now use `toBeInTheDocument`, `toHaveClass`, `toHaveAttribute`, `toHaveStyle`, and `toBeEnabled` matchers consistently. CSS components migrate off deprecated `clip: rect(...)` to `clip-path: inset(50%)`, off duplicate `appearance` declarations, and re-order selectors to comply with `no-descending-specificity`.
- Updated dependencies [79e6c84]
- Updated dependencies [ac50982]
- Updated dependencies [b0601e2]
- Updated dependencies [e3ade86]
- Updated dependencies [3cfd652]
- Updated dependencies [f836e62]
- Updated dependencies [fbe5e56]
- Updated dependencies [1508eaf]
- Updated dependencies [11a184c]
- Updated dependencies [6c5f01d]
- Updated dependencies [84c64c8]
- Updated dependencies [6edfd9a]
- Updated dependencies [be16ab3]
- Updated dependencies [eefef8e]
- Updated dependencies [81d3039]
- Updated dependencies [0be060d]
- Updated dependencies [01f4d61]
- Updated dependencies [7594943]
- Updated dependencies [f9e5744]
- Updated dependencies [00c976b]
- Updated dependencies [2a805f5]
  - @aspect/react@1.0.0
  - @aspect/css@1.0.0
  - @aspect/tokens@0.2.0
