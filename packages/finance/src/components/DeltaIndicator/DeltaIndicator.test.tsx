import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { DeltaIndicator } from './DeltaIndicator';

describe('DeltaIndicator', () => {
  it('renders positive delta', () => {
    render(<DeltaIndicator value={0.024} />);
    expect(screen.getByText('+2.4%')).toBeInTheDocument();
  });

  it('renders negative delta', () => {
    render(<DeltaIndicator value={-0.018} />);
    expect(screen.getByText('-1.8%')).toBeInTheDocument();
  });

  it('applies the correct intent class', () => {
    const { container } = render(<DeltaIndicator value={0.05} />);
    expect(container.firstChild).toHaveClass('mizu-delta--positive');
  });

  it('renders a skeleton when loading', () => {
    render(<DeltaIndicator value={0.024} loading />);
    expect(screen.queryByText('+2.4%')).not.toBeInTheDocument();
  });

  it('sets aria-busy and default loading label', () => {
    const { container } = render(<DeltaIndicator value={0.024} loading />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('aria-label', 'Loading delta');
  });

  it('has no axe violations in loading state', async () => {
    const { container } = render(<DeltaIndicator value={0.024} loading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
