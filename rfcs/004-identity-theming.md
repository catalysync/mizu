# RFC-004: CSS-only identity theming

Status: accepted
Date: 2026-04-01

## Context

mizu needs to demonstrate visual flexibility — the same components rendered in 21 different visual identities (Atlassian, Material, Stripe, Sage, etc.). This requires both token overrides (colors, radii, shadows) and structural overrides (pill buttons, dark table headers, floating labels).

## Decision

Identity themes are pure CSS files that use two mechanisms:

1. **Token overrides**: `[data-mizu-identity="sage"] { --mizu-action-primary-default: #007e45; }`
2. **Structural overrides**: `[data-mizu-identity="sage"] .mizu-button { border-radius: 2rem; }`

Applied by setting `data-mizu-identity` on a root element. No React refactoring needed.

## Alternatives considered

- **React variant props for every identity**: Would require every component to accept identity-specific props. Massive API surface, poor scalability.
- **CSS-in-JS theme provider**: Would couple theming to React. Our CSS themes work with any framework.
- **Tailwind theme variants**: Would require Tailwind as a hard dependency.

## Consequences

- 21 identities with zero React changes
- Themes are CSS-only and framework-agnostic
- Storybook toolbar switcher activates them via `data-mizu-identity` attribute
- Trade-off: structural overrides use specificity (component selector inside attribute selector) which can be overridden accidentally
