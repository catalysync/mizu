import * as React from 'react';
import { cn } from '@aspect/react';

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  footer?: React.ReactNode;
}

export const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  ({ label, value, footer, className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-kpi-card', className)} {...props}>
      <span className="mizu-kpi-card__label">{label}</span>
      <span className="mizu-kpi-card__value">{value}</span>
      {footer && <div className="mizu-kpi-card__footer">{footer}</div>}
    </div>
  ),
);
KpiCard.displayName = 'KpiCard';
