import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders with given text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it.each(['neutral', 'success', 'warning', 'danger', 'info'] as const)(
    'applies the %s tone class',
    (tone) => {
      const { container } = render(<Badge tone={tone}>Label</Badge>);
      expect(container.firstChild).toHaveClass(`mizu-badge--${tone}`);
    },
  );

  it('renders dot when dot prop is true', () => {
    const { container } = render(<Badge dot>Running</Badge>);
    expect(container.querySelector('.mizu-badge__dot')).toBeInTheDocument();
  });

  it('does not render dot by default', () => {
    const { container } = render(<Badge>Draft</Badge>);
    expect(container.querySelector('.mizu-badge__dot')).not.toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Badge className="custom">Test</Badge>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Badge tone="danger">Error</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
