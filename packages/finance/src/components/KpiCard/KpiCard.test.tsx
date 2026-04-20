import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { KpiCard } from './KpiCard';

describe('KpiCard', () => {
  it('renders label and value', () => {
    render(<KpiCard label="Revenue" value="$1.2M" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1.2M')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(<KpiCard label="P&L" value="$500K" footer={<span>vs last month</span>} />);
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('renders a skeleton when loading', () => {
    render(<KpiCard label="Revenue" value="$1.2M" loading />);
    expect(screen.queryByText('$1.2M')).not.toBeInTheDocument();
    expect(screen.queryByText('Revenue')).not.toBeInTheDocument();
  });

  it('sets aria-busy and a default loading label', () => {
    const { container } = render(<KpiCard label="Revenue" value="$1.2M" loading />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('aria-label', 'Loading Revenue');
  });

  it('respects a custom loadingLabel', () => {
    const { container } = render(
      <KpiCard label="Revenue" value="$1.2M" loading loadingLabel="Fetching revenue metric" />,
    );
    expect(container.firstChild).toHaveAttribute('aria-label', 'Fetching revenue metric');
  });

  it('has no axe violations in loading state', async () => {
    const { container } = render(<KpiCard label="Revenue" value="$1.2M" loading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
