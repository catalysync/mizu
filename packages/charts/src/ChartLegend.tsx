import * as React from 'react';
import { Legend as RechartsLegend } from 'recharts';
import { cn } from '@aspect/react';

import { useChartContext } from './ChartContainer';

export const ChartLegend = RechartsLegend;

type RechartsLegendProps = React.ComponentProps<typeof RechartsLegend>;
type LegendPayloadItem = NonNullable<RechartsLegendProps['payload']>[number];

export interface ChartLegendContentProps
  extends React.HTMLAttributes<HTMLUListElement>, Pick<RechartsLegendProps, 'payload'> {
  hideIcon?: boolean;
}

export const ChartLegendContent = React.forwardRef<HTMLUListElement, ChartLegendContentProps>(
  ({ payload, hideIcon, className, ...props }, ref) => {
    const { config } = useChartContext();
    if (!payload?.length) return null;

    return (
      <ul ref={ref} className={cn('mizu-chart__legend', className)} {...props}>
        {payload.map((item: LegendPayloadItem, index) => {
          const key = String(item.dataKey ?? item.value ?? index);
          const label = config[key]?.label ?? item.value ?? key;
          return (
            <li key={`${key}-${index}`} className="mizu-chart__legend-item">
              {!hideIcon ? (
                <span
                  className="mizu-chart__legend-swatch"
                  style={{ background: item.color }}
                  aria-hidden="true"
                />
              ) : null}
              <span className="mizu-chart__legend-label">{label}</span>
            </li>
          );
        })}
      </ul>
    );
  },
);
ChartLegendContent.displayName = 'ChartLegendContent';
