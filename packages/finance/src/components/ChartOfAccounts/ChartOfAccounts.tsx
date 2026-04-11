import * as React from 'react';
import { cn } from '@aspect/react';
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
  ({ className, accounts, currency = 'USD', locale = 'en-US', onAccountClick, ...props }, ref) => {
    const rows = React.useMemo(() => flatten(accounts), [accounts]);
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
            onClick={onAccountClick ? () => onAccountClick(node.id) : undefined}
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
