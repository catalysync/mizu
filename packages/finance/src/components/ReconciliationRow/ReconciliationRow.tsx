import * as React from 'react';
import { cn } from '@aspect/react';
import { formatCurrency } from '../../utils/currency';

export type ReconciliationStatus = 'matched' | 'unmatched' | 'disputed' | 'pending';

export interface ReconciliationRowProps extends React.HTMLAttributes<HTMLDivElement> {
  date: string;
  description: React.ReactNode;
  amount: number;
  status: ReconciliationStatus;
  match?: React.ReactNode;
  currency?: string;
  locale?: string;
}

const STATUS_ICON: Record<ReconciliationStatus, string> = {
  matched: '✓',
  unmatched: '!',
  disputed: '⚠',
  pending: '…',
};

const STATUS_LABEL: Record<ReconciliationStatus, string> = {
  matched: 'Matched',
  unmatched: 'Unmatched',
  disputed: 'Disputed',
  pending: 'Pending',
};

export const ReconciliationRow = React.forwardRef<HTMLDivElement, ReconciliationRowProps>(
  (
    {
      className,
      date,
      description,
      amount,
      status,
      match,
      currency = 'USD',
      locale = 'en-US',
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn('mizu-reconciliation-row', className)}
      data-component="mizu-reconciliation-row"
      data-status={status}
      role="row"
      {...props}
    >
      <span
        className="mizu-reconciliation-row__status"
        aria-label={STATUS_LABEL[status]}
        title={STATUS_LABEL[status]}
      >
        {STATUS_ICON[status]}
      </span>
      <span className="mizu-reconciliation-row__date" role="cell">
        {date}
      </span>
      <span className="mizu-reconciliation-row__description" role="cell">
        {description}
        {match != null ? (
          <>
            <br />
            <span className="mizu-reconciliation-row__match">{match}</span>
          </>
        ) : null}
      </span>
      <span className="mizu-reconciliation-row__amount" role="cell">
        {formatCurrency(amount, currency, locale)}
      </span>
      <span className="mizu-reconciliation-row__match" role="cell">
        {STATUS_LABEL[status]}
      </span>
    </div>
  ),
);
ReconciliationRow.displayName = 'ReconciliationRow';
