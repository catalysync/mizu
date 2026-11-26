# @mizunagara/lint

ESLint and stylelint rules for the mizu design system. The rules keep components on
`--mizu-*` tokens, keep identity themes to tokens, and catch accessibility patterns that
lint and typecheck do not.

Stylelint rules (`@mizunagara/lint/stylelint`):

- `mizu/no-hex-color`: no hex literal in a declaration value. A hex inside a `var()` fallback is allowed, and so are `url()` and quoted strings.
- `mizu/var-fallback`: a colour declaration that reads a `--mizu-*` token needs a non-empty `var()` fallback, including nested fallbacks.
- `mizu/identity-tokens-only`: a file that defines `[data-mizu-identity]` may only style that attribute (optionally narrowed by more data attributes) and only set custom properties. Keyframe steps are exempt.

ESLint rules (`@mizunagara/lint/eslint`):

- `mizu/icon-button-label`: `IconButton` needs a non-empty `aria-label` or `aria-labelledby`.
- `mizu/aria-invalid-bound-style`: `aria-invalid` on a plain element needs a `data-invalid` binding. Form controls and components are not checked.
- `mizu/no-static-click`: `onClick` on a non-interactive element (a `label` included) needs a `role`.

The package is private for now: its ES module build does not load from CommonJS, which the
export-shape gate (`scripts/check-exports.mjs`) reports. Run the rule tests with
`pnpm --filter @mizunagara/lint test`.
