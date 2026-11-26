# @mizunagara/lint

ESLint and stylelint rules for the mizu design system. The rules keep components on
`--mizu-*` tokens, keep identity themes to tokens, and catch accessibility patterns that
lint and typecheck do not.

Stylelint rules (`@mizunagara/lint/stylelint`):

- `mizu/no-hex-color`: no hex literal in a declaration value. A hex inside a `var()` fallback is allowed.
- `mizu/var-fallback`: a colour declaration that reads a `--mizu-*` token needs a `var()` fallback.
- `mizu/identity-tokens-only`: a file that defines `[data-mizu-identity]` may only set custom properties on that attribute.

ESLint rules (`@mizunagara/lint/eslint`):

- `mizu/icon-button-label`: `IconButton` needs an `aria-label`.
- `mizu/aria-invalid-bound-style`: `aria-invalid` needs a `data-invalid` binding so the error is styled.
- `mizu/no-static-click`: `onClick` on a non-interactive element needs a `role`.

The package is private for now: its ES module build does not load from CommonJS, which the
export-shape gate (`scripts/check-exports.mjs`) reports. Run the rule tests with
`pnpm --filter @mizunagara/lint test`.
