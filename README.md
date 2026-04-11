<p align="left">
  <img src=".github/mizu-logo.svg" alt="mizu" height="40" />
</p>

# mizu

fluid design for saas

## What mizu is

**mizu is a base layer on top of Radix.** Radix handles the hard primitives (focus trap, overlay positioning, ARIA wiring, keyboard semantics); mizu adds the visual substrate — tokens, CSS, React bindings, layout primitives, shell composition, and framework bridges — so a product team can assemble an application without rebuilding the foundations.

**mizu does not have a design language.** It ships with a neutral default theme as a starting point, but that theme is a _sample_, not the system's opinion. There is no "mizu believes X about UI" manifesto. The same components are meant to serve very different products — enterprise accounting, Palantir-style IDEs, commerce dashboards — and each of those has its own principles, vocabulary, grammar and voice. mizu stays deliberately language-absent so it can be the canvas for all of them.

This matters for how you read the docs: guidance about accessibility, semantic HTML, component composition, and prop API usage is authoritative and applies everywhere. Guidance about _visual style_ — colors, radii, motion curves, voice — is only ever a recommendation from the default sample. Override freely.

> The layer that **does** have a design language is [tweakmizu](https://github.com/catalysync/tweakmizu) — the studio that lets each product author its own language on top of mizu and export a themed, component-configured starter. mizu is the canvas; tweakmizu is where the painting happens.

## Quick start

```bash
pnpm add @aspect/react @aspect/css @aspect/tokens
```

```css
@import '@aspect/tokens/css';
@import '@aspect/css';
```

```tsx
import { Button } from '@aspect/react';
```

No React? Use the CSS classes directly:

```html
<button class="mizu-button mizu-button--primary mizu-button--md">Go</button>
```

## Packages

| Package                   | What it does                                                 |
| ------------------------- | ------------------------------------------------------------ |
| `@aspect/tokens`          | Design tokens → CSS variables, JSON, ES module, React Native |
| `@aspect/css`             | Framework-agnostic component CSS                             |
| `@aspect/react`           | React components (Radix + CVA + tsup)                        |
| `@aspect/finance`         | Finance industry components and utilities                    |
| `@aspect/tailwind-preset` | Tailwind v4 theme bridge                                     |
| `@aspect/tsconfig`        | Shared TypeScript configs                                    |

## Apps

| App       | URL                                                            |
| --------- | -------------------------------------------------------------- |
| Storybook | [mizu-storybook.vercel.app](https://mizu-storybook.vercel.app) |
| Docs      | [mizu-docs.vercel.app](https://mizu-docs.vercel.app)           |

## Development

```bash
pnpm install
pnpm turbo build        # build everything
pnpm turbo dev          # dev servers
pnpm turbo test         # vitest
pnpm turbo lint         # eslint + stylelint
pnpm turbo typecheck    # tsc --noEmit
```

## Stack

pnpm workspaces, Turborepo, Style Dictionary 5 (DTCG), lightningcss, React 19, Radix UI, CVA, tsup, vitest + vitest-axe, ESLint flat config + jsx-a11y, Storybook 10, Next.js 16, Changesets.

## License

MIT
