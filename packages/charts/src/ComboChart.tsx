import * as React from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';

import { ChartContainer } from './ChartContainer';
import { ChartEmpty } from './ChartEmpty';
import { ChartLegend, ChartLegendContent } from './ChartLegend';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartTooltip, ChartTooltipContent } from './ChartTooltip';
import { resolveColor } from './utils/colors';
import { cartesianGridProps, chartTooltipProps, xAxisProps, yAxisProps } from './utils/elements';
import { prepareData } from './utils/muncher';
import type { ChartBaseProps, ChartConfig } from './utils/types';

export interface ComboChartProps<K extends ChartConfig = ChartConfig> extends ChartBaseProps<K> {
  /** Series keys rendered as bars. Remaining keys render as lines. */
  bars: (keyof K)[];
  lineType?: 'natural' | 'linear' | 'monotone' | 'step';
}

function ComboChartInner<K extends ChartConfig>(
  {
    data,
    dataConfig,
    xAxis,
    yAxis = { hide: true },
    bars,
    lineType = 'natural',
    hideTooltip,
    hideGrid,
    hideLegend,
    height,
    loading,
    loadingLabel,
    emptyMessage,
    className,
    ...props
  }: ComboChartProps<K>,
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

  const barKeys = bars;
  const lineKeys = (Object.keys(dataConfig) as (keyof K)[]).filter((k) => !barKeys.includes(k));
  const prepared = prepareData(data);
  const showLegend = !hideLegend && barKeys.length + lineKeys.length > 1;

  return (
    <ChartContainer
      ref={ref}
      config={dataConfig}
      height={height}
      className={className}
      role="img"
      {...props}
    >
      <ComposedChart
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
        {barKeys.map((key, index) => (
          <Bar
            key={`bar-${String(key)}`}
            dataKey={String(key)}
            fill={resolveColor(dataConfig[key].color, index)}
            radius={4}
            maxBarSize={32}
            isAnimationActive={false}
          />
        ))}
        {lineKeys.map((key, index) => (
          <Line
            key={`line-${String(key)}`}
            dataKey={String(key)}
            type={lineType}
            stroke={resolveColor(dataConfig[key].color, barKeys.length + index)}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
        {showLegend && <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" />}
      </ComposedChart>
    </ChartContainer>
  );
}

export const ComboChart = React.forwardRef(ComboChartInner) as <K extends ChartConfig>(
  props: ComboChartProps<K> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;
(ComboChart as { displayName?: string }).displayName = 'ComboChart';
