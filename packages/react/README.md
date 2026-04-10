# @aspect/react

React components for the mizu design system. Built with [Radix](https://www.radix-ui.com/) primitives, [CVA](https://cva.style/) for variants, and [tsup](https://tsup.egoist.dev/) for bundling.

## Installation

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

## Development

```bash
pnpm build       # tsup → dist/
pnpm dev         # tsup --watch
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
pnpm test        # vitest
```
