import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LedgerRow } from './LedgerRow';

describe('LedgerRow', () => {
  it('renders a debit entry', () => {
    render(
      <LedgerRow
        date="2026-04-11"
        description="Office supplies"
        reference="INV-001"
        debit={120}
        balance={5120}
      />,
    );
    expect(screen.getByText('Office supplies')).toBeInTheDocument();
    expect(screen.getByText('INV-001')).toBeInTheDocument();
    expect(screen.getByText('$120.00')).toBeInTheDocument();
    expect(screen.getByText('$5,120.00')).toBeInTheDocument();
  });

  it('renders a negative balance in accounting format', () => {
    const { container } = render(<LedgerRow description="Overdraft" balance={-200} />);
    expect(screen.getByText('($200.00)')).toBeInTheDocument();
    expect(container.querySelector('.mizu-ledger-row__balance')).toHaveAttribute(
      'data-negative',
      'true',
    );
  });

  it('omits empty debit/credit cells', () => {
    render(<LedgerRow description="Note" />);
    expect(screen.getByText('Note')).toBeInTheDocument();
  });

  it('applies the subtotal kind', () => {
    const { container } = render(<LedgerRow description="Total" kind="subtotal" balance={1000} />);
    expect(container.firstChild).toHaveAttribute('data-kind', 'subtotal');
  });
});
