import * as React from 'react';
import { Area, AreaChart as RAreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartContainer } from './ChartContainer';
import { ChartTooltip, ChartTooltipContent } from './ChartTooltip';
import { ChartLegend, ChartLegendContent } from './ChartLegend';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartEmpty } from './ChartEmpty';
import { resolveColor } from './utils/colors';
import { cartesianGridProps, chartTooltipProps, xAxisProps, yAxisProps } from './utils/elements';
import { prepareData } from './utils/muncher';
import type { ChartBaseProps, ChartConfig } from './utils/types';

export interface AreaChartProps<K extends ChartConfig = ChartConfig> extends ChartBaseProps<K> {
  lineType?: 'natural' | 'linear' | 'monotone' | 'step';
}

function AreaChartInner<K extends ChartConfig>(
  {
    data,
    dataConfig,
    xAxis,
    yAxis = { hide: true },
    lineType = 'monotone',
    hideTooltip,
    hideGrid,
    hideLegend,
    height,
    loading,
    loadingLabel,
    emptyMessage,
    className,
    ...props
  }: AreaChartProps<K>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const chartId = React.useId().replace(/:/g, '');

  if (loading)
    return (
      <ChartSkeleton
        ref={ref}
        shape="area"
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
      <RAreaChart
        accessibilityLayer
        data={prepared}
        margin={{ left: yAxis?.hide ? 12 : 0, right: 12 }}
      >
        <defs>
          {series.map((key, index) => {
            const color = resolveColor(dataConfig[key].color, index);
            return (
              <linearGradient
                key={String(key)}
                id={`mizu-area-${chartId}-${String(key)}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            );
          })}
        </defs>
        {!hideGrid && <CartesianGrid {...cartesianGridProps()} />}
        {!xAxis?.hide && <XAxis {...xAxisProps(xAxis)} />}
        {!yAxis?.hide && <YAxis {...yAxisProps(yAxis)} width={yAxis?.width} />}
        {!hideTooltip && (
          <ChartTooltip
            {...chartTooltipProps()}
            content={<ChartTooltipContent valueFormatter={yAxis?.tickFormatter} />}
          />
        )}
        {series.map((key, index) => {
          const color = resolveColor(dataConfig[key].color, index);
          return (
            <Area
              key={String(key)}
              dataKey={String(key)}
              type={lineType}
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#mizu-area-${chartId}-${String(key)})`}
              isAnimationActive={false}
            />
          );
        })}
        {showLegend && <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" />}
      </RAreaChart>
    </ChartContainer>
  );
}

export const AreaChart = React.forwardRef(AreaChartInner) as <K extends ChartConfig>(
  props: AreaChartProps<K> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;
(AreaChart as { displayName?: string }).displayName = 'AreaChart';
