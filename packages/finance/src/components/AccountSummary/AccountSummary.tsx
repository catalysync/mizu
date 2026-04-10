import * as React from 'react';
import { cn } from '@aspect/react';

export interface AccountSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  balance: React.ReactNode;
  delta?: React.ReactNode;
}

export const AccountSummary = React.forwardRef<HTMLDivElement, AccountSummaryProps>(
  ({ name, balance, delta, className, ...props }, ref) => (
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
  ),
);
AccountSummary.displayName = 'AccountSummary';
