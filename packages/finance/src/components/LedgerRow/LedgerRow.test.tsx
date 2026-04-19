import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
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

  it('renders skeleton cells when loading', () => {
    render(<LedgerRow description="Office supplies" loading />);
    expect(screen.queryByText('Office supplies')).not.toBeInTheDocument();
  });

  it('keeps role=row and sets aria-busy when loading', () => {
    const { container } = render(<LedgerRow description="ignored" loading />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'row');
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('aria-label', 'Loading ledger row');
  });

  it('has no axe violations in loading state', async () => {
    const { container } = render(
      <div role="table">
        <LedgerRow description="ignored" loading />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
