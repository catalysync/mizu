import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { TransactionRow } from './TransactionRow';

describe('TransactionRow', () => {
  it('renders date, description, and formatted amount', () => {
    render(<TransactionRow date="Apr 11" description="Office supplies" amount={-120} />);
    expect(screen.getByText('Apr 11')).toBeInTheDocument();
    expect(screen.getByText('Office supplies')).toBeInTheDocument();
    expect(screen.getByText('-$120.00')).toBeInTheDocument();
  });

  it('renders a skeleton when loading', () => {
    render(<TransactionRow date="Apr 11" description="Office supplies" amount={-120} loading />);
    expect(screen.queryByText('Apr 11')).not.toBeInTheDocument();
    expect(screen.queryByText('Office supplies')).not.toBeInTheDocument();
  });

  it('sets aria-busy and a default loading label', () => {
    const { container } = render(
      <TransactionRow date="Apr 11" description="Office supplies" amount={-120} loading />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('aria-label', 'Loading transaction');
  });

  it('has no axe violations in loading state', async () => {
    const { container } = render(
      <TransactionRow date="Apr 11" description="Office supplies" amount={-120} loading />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
