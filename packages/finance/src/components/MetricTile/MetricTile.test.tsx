import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { MetricTile } from './MetricTile';

describe('MetricTile', () => {
  it('renders label and value', () => {
    render(<MetricTile label="MRR" value="$48.2K" />);
    expect(screen.getByText('MRR')).toBeInTheDocument();
    expect(screen.getByText('$48.2K')).toBeInTheDocument();
  });

  it('renders a skeleton when loading', () => {
    render(<MetricTile label="MRR" value="$48.2K" loading />);
    expect(screen.queryByText('$48.2K')).not.toBeInTheDocument();
    expect(screen.queryByText('MRR')).not.toBeInTheDocument();
  });

  it('sets aria-busy and a default loading label', () => {
    const { container } = render(<MetricTile label="MRR" value="$48.2K" loading />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('aria-label', 'Loading MRR');
  });

  it('has no axe violations in loading state', async () => {
    const { container } = render(<MetricTile label="MRR" value="$48.2K" loading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
