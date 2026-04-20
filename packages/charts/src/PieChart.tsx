import * as React from 'react';
import { Cell, Pie, PieChart as RPieChart } from 'recharts';

import { ChartContainer } from './ChartContainer';
import { ChartEmpty } from './ChartEmpty';
import { ChartLegend, ChartLegendContent } from './ChartLegend';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartTooltip, ChartTooltipContent } from './ChartTooltip';
import { resolveColor } from './utils/colors';
import type { ChartConfig } from './utils/types';

export interface PieChartItem {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  dataConfig?: ChartConfig;
  data: PieChartItem[];
  /** Inner radius in pixels. 0 = full pie. Non-zero = donut. */
  innerRadius?: number;
  outerRadius?: number;
  valueFormatter?: (value: string) => string;
  hideTooltip?: boolean;
  hideLegend?: boolean;
  height?: number | string;
  loading?: boolean;
  loadingLabel?: string;
  emptyMessage?: React.ReactNode;
  'aria-label': string;
}

export const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      data,
      dataConfig = {},
      innerRadius = 64,
      outerRadius = 96,
      valueFormatter,
      hideTooltip,
      hideLegend,
      height,
      loading,
      loadingLabel,
      emptyMessage,
      className,
      ...props
    },
    ref,
  ) => {
    if (loading)
      return (
        <ChartSkeleton
          ref={ref}
          shape="pie"
          height={height}
          loadingLabel={loadingLabel}
          className={className}
        />
      );
    if (!data.length)
      return (
        <ChartEmpty
          ref={ref}
          height={height}
          message={emptyMessage}
          className={className}
          {...props}
        />
      );

    const config: ChartConfig = data.reduce<ChartConfig>(
      (acc, item) => {
        acc[item.label] = {
          label: dataConfig[item.label]?.label ?? item.label,
          color: dataConfig[item.label]?.color ?? item.color,
        };
        return acc;
      },
      { ...dataConfig },
    );

    const prepared = data.map((item, index) => ({
      ...item,
      fill: resolveColor(item.color ?? dataConfig[item.label]?.color, index),
    }));

    return (
      <ChartContainer
        ref={ref}
        config={config}
        height={height}
        className={className}
        role="img"
        {...props}
      >
        <RPieChart accessibilityLayer>
          {!hideTooltip && (
            <ChartTooltip
              content={<ChartTooltipContent hideLabel valueFormatter={valueFormatter} />}
            />
          )}
          <Pie
            data={prepared}
            dataKey="value"
            nameKey="label"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={innerRadius > 0 ? 2 : 0}
            isAnimationActive={false}
          >
            {prepared.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          {!hideLegend && <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" />}
        </RPieChart>
      </ChartContainer>
    );
  },
);
PieChart.displayName = 'PieChart';
