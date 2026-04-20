import { cn, Skeleton } from '@aspect/react';
import * as React from 'react';
import { formatAccounting } from '../../utils/currency';

export type LedgerRowKind = 'entry' | 'subtotal';

export interface LedgerRowProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: string;
  description: React.ReactNode;
  reference?: React.ReactNode;
  debit?: number | null;
  credit?: number | null;
  balance?: number | null;
  currency?: string;
  locale?: string;
  kind?: LedgerRowKind;
  loading?: boolean;
  loadingLabel?: string;
}

export const LedgerRow = React.forwardRef<HTMLDivElement, LedgerRowProps>(
  (
    {
      className,
      date,
      description,
      reference,
      debit,
      credit,
      balance,
      currency = 'USD',
      locale = 'en-US',
      kind = 'entry',
      loading,
      loadingLabel,
      ...props
    },
    ref,
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn('mizu-ledger-row', className)}
          data-component="mizu-ledger-row"
          data-kind={kind}
          role="row"
          aria-busy="true"
          aria-label={loadingLabel ?? 'Loading ledger row'}
          {...props}
        >
          <span className="mizu-ledger-row__cell mizu-ledger-row__date" role="cell">
            <Skeleton variant="text" width="4rem" />
          </span>
          <span className="mizu-ledger-row__cell" role="cell">
            <Skeleton variant="text" width="80%" />
          </span>
          <span className="mizu-ledger-row__cell" role="cell">
            <Skeleton variant="text" width="3rem" />
          </span>
          <span
            className="mizu-ledger-row__cell mizu-ledger-row__debit"
            data-align="end"
            role="cell"
          >
            <Skeleton variant="text" width="4rem" />
          </span>
          <span
            className="mizu-ledger-row__cell mizu-ledger-row__credit"
            data-align="end"
            role="cell"
          >
            <Skeleton variant="text" width="4rem" />
          </span>
          <span
            className="mizu-ledger-row__cell mizu-ledger-row__balance"
            data-align="end"
            role="cell"
          >
            <Skeleton variant="text" width="5rem" />
          </span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('mizu-ledger-row', className)}
        data-component="mizu-ledger-row"
        data-kind={kind}
        role="row"
        {...props}
      >
        <span className="mizu-ledger-row__cell mizu-ledger-row__date" role="cell">
          {date ?? ''}
        </span>
        <span className="mizu-ledger-row__cell" role="cell">
          {description}
        </span>
        <span className="mizu-ledger-row__cell" role="cell">
          {reference ?? ''}
        </span>
        <span className="mizu-ledger-row__cell mizu-ledger-row__debit" data-align="end" role="cell">
          {debit != null && debit !== 0 ? formatAccounting(debit, currency, locale) : ''}
        </span>
        <span
          className="mizu-ledger-row__cell mizu-ledger-row__credit"
          data-align="end"
          role="cell"
        >
          {credit != null && credit !== 0 ? formatAccounting(credit, currency, locale) : ''}
        </span>
        <span
          className="mizu-ledger-row__cell mizu-ledger-row__balance"
          data-align="end"
          data-negative={balance != null && balance < 0 ? 'true' : undefined}
          role="cell"
        >
          {balance != null ? formatAccounting(balance, currency, locale) : ''}
        </span>
      </div>
    );
  },
);
LedgerRow.displayName = 'LedgerRow';
