# @mizunagara/react

React components for the mizu design system. Built with [Radix](https://www.radix-ui.com/) primitives, [CVA](https://cva.style/) for variants, and [tsup](https://tsup.egoist.dev/) for bundling.

## Installation

```bash
pnpm add @mizunagara/react @mizunagara/css @mizunagara/tokens
```

```css
@import '@mizunagara/tokens/css';
@import '@mizunagara/css';
```

```tsx
import { Button } from '@mizunagara/react';
```

## Development

```bash
pnpm build       # tsup → dist/
pnpm dev         # tsup --watch
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
pnpm test        # vitest
```
