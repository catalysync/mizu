# @aspect/charts

Chart components for the mizu design system, built on [recharts](https://recharts.org).

## Install

```sh
pnpm add @aspect/charts recharts
```

Charts pick colors from `--mizu-chart-categorical-{1..8}` tokens. Import the base CSS once:

```css
@import '@aspect/tokens/css';
@import '@aspect/css';
@import '@aspect/css/components/chart'; /* or cherry-pick */
```

## Usage

```tsx
import { LineChart } from '@aspect/charts';

<LineChart
  aria-label="Monthly revenue"
  dataConfig={{ revenue: { label: 'Revenue' } }}
  data={[
    { label: 'Jan', values: { revenue: 1200 } },
    { label: 'Feb', values: { revenue: 1800 } },
    { label: 'Mar', values: { revenue: 2400 } },
  ]}
/>;
```

## Charts

- `LineChart` — time series, one or more series
- `BarChart` — vertical bars, simple or stacked
- `VerticalBarChart` — horizontal bars
- `AreaChart` — filled line series
- `PieChart` — proportions, optional donut center label
- `ComboChart` — mixed bar + line on a single canvas

All charts accept a `loading` prop (renders a skeleton) and require `aria-label` for screen readers.
