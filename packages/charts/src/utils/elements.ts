import type { ComponentProps } from 'react';
import type { XAxis, YAxis } from 'recharts';

import type { AxisConfig } from './types';

export const xAxisProps = (config?: AxisConfig): Partial<ComponentProps<typeof XAxis>> => ({
  dataKey: 'x',
  tickLine: false,
  axisLine: false,
  tickMargin: 8,
  domain: config?.domain,
  ticks: config?.ticks,
  tickCount: config?.tickCount,
  tickFormatter: config?.tickFormatter,
});

export const yAxisProps = (config?: AxisConfig): Partial<ComponentProps<typeof YAxis>> => ({
  tickLine: false,
  axisLine: false,
  tickMargin: 8,
  domain: config?.domain,
  ticks: config?.ticks,
  tickCount: config?.tickCount,
  tickFormatter: config?.tickFormatter,
});

export const cartesianGridProps = () => ({
  vertical: false,
  strokeDasharray: '4',
});

export const chartTooltipProps = () => ({
  cursor: true,
  offset: 20,
  animationDuration: 100,
  isAnimationActive: true,
});
