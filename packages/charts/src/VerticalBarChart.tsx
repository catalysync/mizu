import * as React from 'react';
import { Bar, BarChart as RBarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartContainer } from './ChartContainer';
import { ChartTooltip, ChartTooltipContent } from './ChartTooltip';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartEmpty } from './ChartEmpty';
import { resolveColor } from './utils/colors';
import { cartesianGridProps, chartTooltipProps, xAxisProps, yAxisProps } from './utils/elements';
import { prepareData } from './utils/muncher';
import type { ChartBaseProps, ChartConfig } from './utils/types';

export type VerticalBarChartProps<K extends ChartConfig = ChartConfig> = ChartBaseProps<K>;

function VerticalBarChartInner<K extends ChartConfig>(
  {
    data,
    dataConfig,
    xAxis = { hide: true },
    yAxis,
    hideTooltip,
    hideGrid,
    height,
    loading,
    loadingLabel,
    emptyMessage,
    className,
    ...props
  }: VerticalBarChartProps<K>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  if (loading)
    return (
      <ChartSkeleton
        ref={ref}
        shape="vertical-bar"
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

  const series = Object.keys(dataConfig) as (keyof K)[];
  const prepared = prepareData(data);

  return (
    <ChartContainer
      ref={ref}
      config={dataConfig}
      height={height}
      className={className}
      role="img"
      {...props}
    >
      <RBarChart
        accessibilityLayer
        data={prepared}
        layout="vertical"
        margin={{ left: 8, right: 12 }}
      >
        {!hideGrid && <CartesianGrid {...cartesianGridProps()} vertical horizontal={false} />}
        <XAxis {...xAxisProps(xAxis)} dataKey={undefined} type="number" hide={xAxis?.hide} />
        <YAxis {...yAxisProps(yAxis)} dataKey="x" type="category" width={yAxis?.width} />
        {!hideTooltip && (
          <ChartTooltip
            {...chartTooltipProps()}
            content={<ChartTooltipContent valueFormatter={xAxis?.tickFormatter} />}
          />
        )}
        {series.map((key, index) => (
          <Bar
            key={String(key)}
            dataKey={String(key)}
            fill={resolveColor(dataConfig[key].color, index)}
            radius={4}
            maxBarSize={32}
            isAnimationActive={false}
          />
        ))}
      </RBarChart>
    </ChartContainer>
  );
}

export const VerticalBarChart = React.forwardRef(VerticalBarChartInner) as <K extends ChartConfig>(
  props: VerticalBarChartProps<K> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;
(VerticalBarChart as { displayName?: string }).displayName = 'VerticalBarChart';
