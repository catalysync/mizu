import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders with given text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies the tone class', () => {
    const { container } = render(<Badge tone="success">OK</Badge>);
    expect(container.firstChild).toHaveClass('mizu-badge--success');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Badge tone="danger">Error</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
