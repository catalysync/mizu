import { cn, Skeleton } from '@aspect/react';
import * as React from 'react';

export interface MetricTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  delta?: React.ReactNode;
  chart?: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
}

export const MetricTile = React.forwardRef<HTMLDivElement, MetricTileProps>(
  ({ label, value, delta, chart, loading, loadingLabel, className, ...props }, ref) => {
    if (loading) {
      return (
        <div
          ref={ref}
          role="status"
          className={cn('mizu-metric-tile', className)}
          aria-busy="true"
          aria-label={loadingLabel ?? `Loading ${label}`}
          {...props}
        >
          <div className="mizu-metric-tile__header">
            <Skeleton variant="text" width="55%" />
            {delta !== undefined && <Skeleton variant="text" width="3rem" />}
          </div>
          <Skeleton variant="heading" width="70%" />
          {chart !== undefined && <Skeleton width="100%" height="3rem" />}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('mizu-metric-tile', className)} {...props}>
        <div className="mizu-metric-tile__header">
          <span className="mizu-metric-tile__label">{label}</span>
          {delta}
        </div>
        <span className="mizu-metric-tile__value">{value}</span>
        {chart && <div className="mizu-metric-tile__chart">{chart}</div>}
      </div>
    );
  },
);
MetricTile.displayName = 'MetricTile';
