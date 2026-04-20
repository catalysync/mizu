import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ChartOfAccounts, type ChartOfAccountsNode } from './ChartOfAccounts';

const ACCOUNTS: ChartOfAccountsNode[] = [
  {
    id: 'assets',
    code: '1000',
    name: 'Assets',
    type: 'asset',
    balance: 45000,
    children: [
      { id: 'cash', code: '1100', name: 'Cash', type: 'asset', balance: 12000 },
      { id: 'ar', code: '1200', name: 'Accounts receivable', type: 'asset', balance: 33000 },
    ],
  },
  {
    id: 'liabilities',
    code: '2000',
    name: 'Liabilities',
    type: 'liability',
    balance: -15000,
  },
];

describe('ChartOfAccounts', () => {
  it('renders all accounts including nested children', () => {
    render(<ChartOfAccounts accounts={ACCOUNTS} />);
    expect(screen.getByText('Assets')).toBeInTheDocument();
    expect(screen.getByText('Cash')).toBeInTheDocument();
    expect(screen.getByText('Accounts receivable')).toBeInTheDocument();
    expect(screen.getByText('Liabilities')).toBeInTheDocument();
  });

  it('marks parents with data-parent', () => {
    const { container } = render(<ChartOfAccounts accounts={ACCOUNTS} />);
    const rows = container.querySelectorAll('.mizu-chart-of-accounts__row');
    expect(rows[0]).toHaveAttribute('data-parent', 'true');
    expect(rows[1]).not.toHaveAttribute('data-parent');
  });

  it('marks nested children with increasing depth', () => {
    const { container } = render(<ChartOfAccounts accounts={ACCOUNTS} />);
    const cashRow = container.querySelectorAll('.mizu-chart-of-accounts__row')[1];
    expect(cashRow).toHaveAttribute('data-depth', '1');
  });

  it('formats negative balances as accounting format', () => {
    render(<ChartOfAccounts accounts={ACCOUNTS} />);
    expect(screen.getByText('($15,000.00)')).toBeInTheDocument();
  });

  it('calls onAccountClick', () => {
    const onAccountClick = vi.fn();
    const { container } = render(
      <ChartOfAccounts accounts={ACCOUNTS} onAccountClick={onAccountClick} />,
    );
    const firstRow = container.querySelector('.mizu-chart-of-accounts__row')!;
    fireEvent.click(firstRow);
    expect(onAccountClick).toHaveBeenCalledWith('assets');
  });

  it('renders skeleton rows when loading', () => {
    const { container } = render(<ChartOfAccounts accounts={ACCOUNTS} loading loadingRows={3} />);
    expect(screen.queryByText('Assets')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.mizu-chart-of-accounts__row').length).toBe(3);
  });

  it('sets aria-busy and default loading label', () => {
    const { container } = render(<ChartOfAccounts accounts={ACCOUNTS} loading />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('aria-label', 'Loading chart of accounts');
  });

  it('has no axe violations in loading state', async () => {
    const { container } = render(<ChartOfAccounts accounts={ACCOUNTS} loading loadingRows={2} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
