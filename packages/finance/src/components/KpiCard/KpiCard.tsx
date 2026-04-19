import * as React from 'react';
import { cn, Skeleton } from '@aspect/react';

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
}

export const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  ({ label, value, footer, loading, loadingLabel, className, ...props }, ref) => {
    if (loading) {
      return (
        <div
          ref={ref}
          role="status"
          className={cn('mizu-kpi-card', className)}
          aria-busy="true"
          aria-label={loadingLabel ?? `Loading ${label}`}
          {...props}
        >
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="heading" width="70%" />
          {footer !== undefined && <Skeleton variant="text" width="50%" />}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('mizu-kpi-card', className)} {...props}>
        <span className="mizu-kpi-card__label">{label}</span>
        <span className="mizu-kpi-card__value">{value}</span>
        {footer && <div className="mizu-kpi-card__footer">{footer}</div>}
      </div>
    );
  },
);
KpiCard.displayName = 'KpiCard';
