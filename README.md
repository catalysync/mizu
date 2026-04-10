# mizu

A design system that works across frameworks. Ship tokens, CSS, and React components from one monorepo.

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
