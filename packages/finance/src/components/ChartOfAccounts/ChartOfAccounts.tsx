import { cn, Skeleton } from '@aspect/react';
import * as React from 'react';
import { formatAccounting } from '../../utils/currency';

export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export interface ChartOfAccountsNode {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  balance?: number;
  children?: ChartOfAccountsNode[];
}

export interface ChartOfAccountsProps extends React.HTMLAttributes<HTMLDivElement> {
  accounts: ChartOfAccountsNode[];
  currency?: string;
  locale?: string;
  onAccountClick?: (id: string) => void;
  loading?: boolean;
  loadingRows?: number;
  loadingLabel?: string;
}

function flatten(
  nodes: ChartOfAccountsNode[],
  depth = 0,
): Array<{ node: ChartOfAccountsNode; depth: number; hasChildren: boolean }> {
  const rows: Array<{
    node: ChartOfAccountsNode;
    depth: number;
    hasChildren: boolean;
  }> = [];
  for (const node of nodes) {
    const hasChildren = (node.children?.length ?? 0) > 0;
    rows.push({ node, depth, hasChildren });
    if (hasChildren) rows.push(...flatten(node.children!, depth + 1));
  }
  return rows;
}

export const ChartOfAccounts = React.forwardRef<HTMLDivElement, ChartOfAccountsProps>(
  (
    {
      className,
      accounts,
      currency = 'USD',
      locale = 'en-US',
      onAccountClick,
      loading,
      loadingRows = 6,
      loadingLabel,
      ...props
    },
    ref,
  ) => {
    const rows = React.useMemo(() => flatten(accounts), [accounts]);

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn('mizu-chart-of-accounts', className)}
          data-component="mizu-chart-of-accounts"
          role="table"
          aria-busy="true"
          aria-label={loadingLabel ?? 'Loading chart of accounts'}
          {...props}
        >
          {Array.from({ length: loadingRows }).map((_, i) => (
            <div key={i} className="mizu-chart-of-accounts__row" data-depth={0} role="row">
              <span className="mizu-chart-of-accounts__code" role="cell">
                <Skeleton variant="text" width="3rem" />
              </span>
              <span className="mizu-chart-of-accounts__name" role="cell">
                <Skeleton variant="text" width="70%" />
              </span>
              <span className="mizu-chart-of-accounts__type" role="cell">
                <Skeleton variant="text" width="4rem" />
              </span>
              <span className="mizu-chart-of-accounts__balance" role="cell">
                <Skeleton variant="text" width="5rem" />
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('mizu-chart-of-accounts', className)}
        data-component="mizu-chart-of-accounts"
        role="table"
        aria-label="Chart of accounts"
        {...props}
      >
        {rows.map(({ node, depth, hasChildren }) => (
          <div
            key={node.id}
            className="mizu-chart-of-accounts__row"
            data-depth={depth}
            data-parent={hasChildren || undefined}
            role="row"
            tabIndex={onAccountClick ? 0 : undefined}
            onClick={onAccountClick ? () => onAccountClick(node.id) : undefined}
            onKeyDown={
              onAccountClick
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onAccountClick(node.id);
                    }
                  }
                : undefined
            }
          >
            <span className="mizu-chart-of-accounts__code" role="cell">
              {node.code}
            </span>
            <span className="mizu-chart-of-accounts__name" role="cell">
              {node.name}
            </span>
            <span className="mizu-chart-of-accounts__type" role="cell">
              {node.type}
            </span>
            <span
              className="mizu-chart-of-accounts__balance"
              data-negative={node.balance != null && node.balance < 0 ? 'true' : undefined}
              role="cell"
            >
              {node.balance != null ? formatAccounting(node.balance, currency, locale) : ''}
            </span>
          </div>
        ))}
      </div>
    );
  },
);
ChartOfAccounts.displayName = 'ChartOfAccounts';
