import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { AccountSummary } from './AccountSummary';

describe('AccountSummary', () => {
  it('renders name and balance', () => {
    render(<AccountSummary name="Checking" balance="$12,430.21" />);
    expect(screen.getByText('Checking')).toBeInTheDocument();
    expect(screen.getByText('$12,430.21')).toBeInTheDocument();
  });

  it('renders a skeleton when loading', () => {
    render(<AccountSummary name="Checking" balance="$12,430.21" loading />);
    expect(screen.queryByText('$12,430.21')).not.toBeInTheDocument();
    expect(screen.queryByText('Checking')).not.toBeInTheDocument();
  });

  it('sets aria-busy and a default loading label', () => {
    const { container } = render(<AccountSummary name="Checking" balance="$12,430.21" loading />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('aria-label', 'Loading Checking');
  });

  it('has no axe violations in loading state', async () => {
    const { container } = render(<AccountSummary name="Checking" balance="$12,430.21" loading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
