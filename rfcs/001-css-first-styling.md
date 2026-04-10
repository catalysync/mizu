# RFC-001: CSS-first styling over CSS-in-JS

Status: accepted
Date: 2025-12-01

## Context

Component libraries need a styling strategy. The main options are CSS-in-JS (styled-components, Emotion), utility-first (Tailwind), or plain CSS with custom properties.

## Decision

mizu uses plain CSS with `--mizu-*` custom properties and BEM class names. No runtime CSS-in-JS.

- Tokens are emitted as CSS variables by Style Dictionary
- Components use BEM classes (`.mizu-button--primary`)
- Variants are CSS classes managed by CVA in the React layer
- Theming is done via CSS variable overrides on `[data-mizu-identity]` selectors

## Alternatives considered

- **styled-components**: Runtime cost, incompatible with React Server Components, forces React dependency on the CSS layer. Sage Carbon uses this and is actively migrating away from it.
- **Tailwind utility classes**: Tight coupling to Tailwind version, poor discoverability for non-Tailwind users. We offer a Tailwind v4 bridge as an optional addon instead.
- **CSS Modules**: Generates random class names, making identity theming via selectors impossible.

## Consequences

- CSS package is framework-agnostic — usable with Vue, Svelte, plain HTML
- Zero runtime JS for styling
- Tree-shakeable via per-component CSS imports (`@aspect/css/components/button`)
- Identity themes work via pure CSS selector overrides, no JS needed
- Trade-off: no dynamic style interpolation (handled by `style` prop or CSS variables when needed)
