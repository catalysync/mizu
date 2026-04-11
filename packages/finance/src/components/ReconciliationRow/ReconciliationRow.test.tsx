import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReconciliationRow } from './ReconciliationRow';

describe('ReconciliationRow', () => {
  it('renders a matched row', () => {
    render(
      <ReconciliationRow
        date="2026-04-11"
        description="Stripe payout"
        amount={1200.5}
        status="matched"
        match="INV-0412"
      />,
    );
    expect(screen.getByText('Stripe payout')).toBeInTheDocument();
    expect(screen.getByText('INV-0412')).toBeInTheDocument();
    expect(screen.getByText('$1,200.50')).toBeInTheDocument();
    expect(screen.getAllByText('Matched').length).toBeGreaterThan(0);
  });

  it('applies the status data attribute', () => {
    const { container } = render(
      <ReconciliationRow
        date="2026-04-11"
        description="Unknown charge"
        amount={50}
        status="unmatched"
      />,
    );
    expect(container.firstChild).toHaveAttribute('data-status', 'unmatched');
  });

  it('renders different status icons', () => {
    const { rerender } = render(
      <ReconciliationRow date="" description="" amount={0} status="matched" />,
    );
    expect(screen.getByText('✓')).toBeInTheDocument();
    rerender(<ReconciliationRow date="" description="" amount={0} status="disputed" />);
    expect(screen.getByText('⚠')).toBeInTheDocument();
  });
});
