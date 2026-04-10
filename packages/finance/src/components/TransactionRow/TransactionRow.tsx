import * as React from 'react';
import { cn } from '@aspect/react';
import { formatCurrency } from '../../utils/currency';

export interface TransactionRowProps extends React.HTMLAttributes<HTMLDivElement> {
  date: string;
  description: string;
  amount: number;
  category?: React.ReactNode;
  status?: React.ReactNode;
  currency?: string;
}

export const TransactionRow = React.forwardRef<HTMLDivElement, TransactionRowProps>(
  ({ date, description, amount, category, status, currency = 'USD', className, ...props }, ref) => (
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
  ),
);
TransactionRow.displayName = 'TransactionRow';
