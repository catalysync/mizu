import * as React from 'react';
import { CartesianGrid, Line, LineChart as RLineChart, XAxis, YAxis } from 'recharts';

import { ChartContainer } from './ChartContainer';
import { ChartTooltip, ChartTooltipContent } from './ChartTooltip';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartEmpty } from './ChartEmpty';
import { resolveColor } from './utils/colors';
import { cartesianGridProps, chartTooltipProps, xAxisProps, yAxisProps } from './utils/elements';
import { prepareData } from './utils/muncher';
import type { ChartBaseProps, ChartConfig } from './utils/types';

export interface LineChartProps<K extends ChartConfig = ChartConfig> extends ChartBaseProps<K> {
  lineType?: 'natural' | 'linear' | 'monotone' | 'step';
}

function LineChartInner<K extends ChartConfig>(
  {
    data,
    dataConfig,
    xAxis,
    yAxis = { hide: true },
    lineType = 'natural',
    hideTooltip,
    hideGrid,
    height,
    loading,
    loadingLabel,
    emptyMessage,
    className,
    ...props
  }: LineChartProps<K>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  if (loading)
    return (
      <ChartSkeleton
        ref={ref}
        shape="line"
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
      <RLineChart
        accessibilityLayer
        data={prepared}
        margin={{ left: yAxis?.hide ? 12 : 0, right: 12 }}
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
          <Line
            key={String(key)}
            dataKey={String(key)}
            type={lineType}
            stroke={resolveColor(dataConfig[key].color, index)}
            strokeWidth={1.5}
            strokeDasharray={dataConfig[key].dashed ? '4 4' : undefined}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </RLineChart>
    </ChartContainer>
  );
}

export const LineChart = React.forwardRef(LineChartInner) as <K extends ChartConfig>(
  props: LineChartProps<K> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;
(LineChart as { displayName?: string }).displayName = 'LineChart';
