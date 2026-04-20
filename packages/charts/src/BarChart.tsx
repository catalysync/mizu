import * as React from 'react';
import { Bar, CartesianGrid, BarChart as RBarChart, XAxis, YAxis } from 'recharts';

import { ChartContainer } from './ChartContainer';
import { ChartEmpty } from './ChartEmpty';
import { ChartLegend, ChartLegendContent } from './ChartLegend';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartTooltip, ChartTooltipContent } from './ChartTooltip';
import { resolveColor } from './utils/colors';
import { cartesianGridProps, chartTooltipProps, xAxisProps, yAxisProps } from './utils/elements';
import { prepareData } from './utils/muncher';
import type { ChartBaseProps, ChartConfig } from './utils/types';

export interface BarChartProps<K extends ChartConfig = ChartConfig> extends ChartBaseProps<K> {
  stacked?: boolean;
}

function BarChartInner<K extends ChartConfig>(
  {
    data,
    dataConfig,
    xAxis,
    yAxis = { hide: true },
    stacked,
    hideTooltip,
    hideGrid,
    hideLegend,
    height,
    loading,
    loadingLabel,
    emptyMessage,
    className,
    ...props
  }: BarChartProps<K>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  if (loading)
    return (
      <ChartSkeleton
        ref={ref}
        shape="bar"
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
  const showLegend = !hideLegend && series.length > 1;

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
        margin={{ left: yAxis?.hide ? 12 : 0, right: 12, top: 8 }}
      >
        {!hideGrid && <CartesianGrid {...cartesianGridProps()} />}
        {!xAxis?.hide && <XAxis {...xAxisProps(xAxis)} />}
        {!yAxis?.hide && <YAxis {...yAxisProps(yAxis)} width={yAxis?.width} />}
        {!hideTooltip && (
          <ChartTooltip
            {...chartTooltipProps()}
            content={<ChartTooltipContent valueFormatter={yAxis?.tickFormatter} />}
          />
        )}
        {series.map((key, index) => (
          <Bar
            key={String(key)}
            dataKey={String(key)}
            stackId={stacked ? 'stack' : undefined}
            fill={resolveColor(dataConfig[key].color, index)}
            radius={4}
            maxBarSize={48}
            isAnimationActive={false}
          />
        ))}
        {showLegend && <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" />}
      </RBarChart>
    </ChartContainer>
  );
}

export const BarChart = React.forwardRef(BarChartInner) as <K extends ChartConfig>(
  props: BarChartProps<K> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;
(BarChart as { displayName?: string }).displayName = 'BarChart';
