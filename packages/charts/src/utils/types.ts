import type * as React from 'react';

export type ChartSeriesConfig = {
  label?: React.ReactNode;
  color?: string;
  dashed?: boolean;
};

export type ChartConfig = Record<string, ChartSeriesConfig>;

export type ChartItem<K extends ChartConfig> = {
  label: string;
  values: { [key in keyof K]: number };
};

export type AxisDomainItem = number | 'auto' | 'dataMin' | 'dataMax';

export type AxisConfig = {
  hide?: boolean;
  tickFormatter?: (value: string) => string;
  tickCount?: number;
  ticks?: number[];
  domain?: [AxisDomainItem, AxisDomainItem];
  width?: number;
};

export interface ChartBaseProps<K extends ChartConfig = ChartConfig> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  dataConfig: K;
  data: ChartItem<K>[];
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  hideGrid?: boolean;
  hideTooltip?: boolean;
  hideLegend?: boolean;
  height?: number | string;
  loading?: boolean;
  loadingLabel?: string;
  emptyMessage?: React.ReactNode;
  /** Required for screen readers. */
  'aria-label': string;
}
