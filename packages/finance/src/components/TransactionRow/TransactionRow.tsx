import { cn, Skeleton } from '@aspect/react';
import * as React from 'react';
import { formatCurrency } from '../../utils/currency';

export interface TransactionRowProps extends React.HTMLAttributes<HTMLDivElement> {
  date: string;
  description: string;
  amount: number;
  category?: React.ReactNode;
  status?: React.ReactNode;
  currency?: string;
  loading?: boolean;
  loadingLabel?: string;
}

export const TransactionRow = React.forwardRef<HTMLDivElement, TransactionRowProps>(
  (
    {
      date,
      description,
      amount,
      category,
      status,
      currency = 'USD',
      loading,
      loadingLabel,
      className,
      ...props
    },
    ref,
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          role="status"
          className={cn('mizu-activity-entry', className)}
          aria-busy="true"
          aria-label={loadingLabel ?? 'Loading transaction'}
          {...props}
        >
          <span className="mizu-caption" style={{ minWidth: '5rem' }}>
            <Skeleton variant="text" width="4rem" />
          </span>
          <div className="mizu-activity-entry__body">
            <Skeleton variant="text" width="70%" />
            {category !== undefined && <Skeleton variant="text" width="30%" />}
          </div>
          {status !== undefined && <Skeleton variant="text" width="3rem" />}
          <Skeleton variant="text" width="4rem" />
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('mizu-activity-entry', className)} {...props}>
        <span className="mizu-caption" style={{ minWidth: '5rem' }}>
          {date}
        </span>
        <div className="mizu-activity-entry__body">
          <div className="mizu-activity-entry__message">{description}</div>
          {category && <div className="mizu-activity-entry__meta">{category}</div>}
        </div>
        {status}
        <span
          className={cn(
            'mizu-body--sm',
            amount < 0 ? 'mizu-delta--negative' : 'mizu-delta--positive',
          )}
          style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}
        >
          {formatCurrency(amount, currency)}
        </span>
      </div>
    );
  },
);
TransactionRow.displayName = 'TransactionRow';
