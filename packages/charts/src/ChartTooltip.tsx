import * as React from 'react';
import { Tooltip as RechartsTooltip } from 'recharts';
import { cn } from '@aspect/react';

import { useChartContext } from './ChartContainer';

export const ChartTooltip = RechartsTooltip;

type RechartsTooltipProps = React.ComponentProps<typeof RechartsTooltip>;
type TooltipPayloadItem = NonNullable<RechartsTooltipProps['payload']>[number];

export interface ChartTooltipContentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Pick<RechartsTooltipProps, 'active' | 'payload' | 'label'> {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  valueFormatter?: (value: string) => string;
  labelFormatter?: (
    label: React.ReactNode,
    payload: readonly TooltipPayloadItem[],
  ) => React.ReactNode;
}

export const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      active,
      payload,
      label,
      hideLabel,
      hideIndicator,
      valueFormatter,
      labelFormatter,
      className,
      ...props
    },
    ref,
  ) => {
    const { config } = useChartContext();
    if (!active || !payload?.length) return null;

    const resolvedLabel =
      !hideLabel && label != null
        ? labelFormatter
          ? labelFormatter(label, payload)
          : label
        : null;

    return (
      <div ref={ref} className={cn('mizu-chart__tooltip', className)} role="tooltip" {...props}>
        {resolvedLabel ? <div className="mizu-chart__tooltip-label">{resolvedLabel}</div> : null}
        <div className="mizu-chart__tooltip-items">
          {payload.map((item, index) => {
            const key = String(item.dataKey ?? item.name ?? index);
            const seriesLabel = config[key]?.label ?? item.name ?? key;
            const indicatorColor = item.color ?? `var(--mizu-chart-categorical-${(index % 8) + 1})`;
            const value = item.value;
            const formatted =
              value == null
                ? ''
                : valueFormatter
                  ? valueFormatter(String(value))
                  : typeof value === 'number'
                    ? value.toLocaleString()
                    : String(value);

            return (
              <div key={`${key}-${index}`} className="mizu-chart__tooltip-item">
                {!hideIndicator ? (
                  <span
                    className="mizu-chart__tooltip-swatch"
                    style={{ background: indicatorColor }}
                    aria-hidden="true"
                  />
                ) : null}
                <span className="mizu-chart__tooltip-name">{seriesLabel}</span>
                <span className="mizu-chart__tooltip-value">{formatted}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = 'ChartTooltipContent';
