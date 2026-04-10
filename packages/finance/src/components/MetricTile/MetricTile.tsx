import * as React from 'react';
import { cn } from '@aspect/react';

export interface MetricTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  delta?: React.ReactNode;
  chart?: React.ReactNode;
}

export const MetricTile = React.forwardRef<HTMLDivElement, MetricTileProps>(
  ({ label, value, delta, chart, className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-metric-tile', className)} {...props}>
      <div className="mizu-metric-tile__header">
        <span className="mizu-metric-tile__label">{label}</span>
        {delta}
      </div>
      <span className="mizu-metric-tile__value">{value}</span>
      {chart && <div className="mizu-metric-tile__chart">{chart}</div>}
    </div>
  ),
);
MetricTile.displayName = 'MetricTile';
