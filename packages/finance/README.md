# @mizunagara/finance

Finance industry components for the mizu design system. Builds on `@mizunagara/react` with finance-specific compositions, utilities, and themes.

## Installation

```bash
pnpm add @mizunagara/finance @mizunagara/react @mizunagara/css @mizunagara/tokens
```

## Components

- `DeltaIndicator` — auto-colored +/- percentage with arrow
- `KpiCard` — label + big value + footer slot
- `MetricTile` — dashboard card with chart slot
- `AnnotationCard` — AI insight callout with icon + body
- `TransactionRow` — date + description + amount + category
- `AccountSummary` — account name + balance + delta

## Utilities

```ts
import { formatCurrency, formatAccounting, formatDelta, formatCompact } from '@mizunagara/finance';

formatCurrency(1234.5); // "$1,234.50"
formatAccounting(-500); // "($500.00)"
formatDelta(0.024); // "+2.4%"
formatCompact(1234567); // "1.2M"
```

## Themes

```css
@import '@mizunagara/finance/themes/reports'; /* QuickBooks-style, monochrome, print-ready */
@import '@mizunagara/finance/themes/insights'; /* Digits-style, dark + vibrant accent */
@import '@mizunagara/finance/themes/analytics'; /* Dense workspace, cool slate */
```

Apply via `data-mizu-theme` attribute on any container.

## Development

```bash
pnpm build       # tsup
pnpm test        # vitest
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
```
