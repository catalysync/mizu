import { cn } from '@aspect/react';
import * as React from 'react';

export type ChartSkeletonShape = 'line' | 'bar' | 'vertical-bar' | 'area' | 'pie';

export interface ChartSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: ChartSkeletonShape;
  height?: number | string;
  loadingLabel?: string;
}

export const ChartSkeleton = React.forwardRef<HTMLDivElement, ChartSkeletonProps>(
  (
    { shape = 'line', height = 320, className, loadingLabel = 'Loading chart', style, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      role="status"
      aria-busy="true"
      aria-label={loadingLabel}
      className={cn('mizu-chart', 'mizu-chart--loading', className)}
      data-shape={shape}
      style={{ height, ...style }}
      {...props}
    >
      {shape === 'pie' ? (
        <div className="mizu-chart__skeleton-pie" aria-hidden="true" />
      ) : shape === 'vertical-bar' ? (
        <div className="mizu-chart__skeleton-vbars" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} style={{ width: `${45 + ((i * 13) % 50)}%` }} />
          ))}
        </div>
      ) : shape === 'bar' ? (
        <div className="mizu-chart__skeleton-bars" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} style={{ height: `${35 + ((i * 17) % 55)}%` }} />
          ))}
        </div>
      ) : (
        <div className="mizu-chart__skeleton-line" aria-hidden="true" />
      )}
    </div>
  ),
);
ChartSkeleton.displayName = 'ChartSkeleton';
