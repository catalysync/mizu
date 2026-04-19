import * as React from 'react';
import { cn, Skeleton } from '@aspect/react';

export interface AccountSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  balance: React.ReactNode;
  delta?: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
}

export const AccountSummary = React.forwardRef<HTMLDivElement, AccountSummaryProps>(
  ({ name, balance, delta, loading, loadingLabel, className, ...props }, ref) => {
    if (loading) {
      return (
        <div
          ref={ref}
          role="status"
          className={cn('mizu-activity-entry', className)}
          aria-busy="true"
          aria-label={loadingLabel ?? `Loading ${name}`}
          {...props}
        >
          <div className="mizu-activity-entry__body">
            <Skeleton variant="text" width="60%" />
          </div>
          {delta !== undefined && <Skeleton variant="text" width="3rem" />}
          <Skeleton variant="text" width="5rem" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('mizu-activity-entry', className)}
        style={{ cursor: 'pointer' }}
        {...props}
      >
        <div className="mizu-activity-entry__body">
          <div className="mizu-activity-entry__message">{name}</div>
        </div>
        {delta}
        <span className="mizu-body--sm" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {balance}
        </span>
      </div>
    );
  },
);
AccountSummary.displayName = 'AccountSummary';
