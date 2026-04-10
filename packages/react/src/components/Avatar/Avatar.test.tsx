import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders an image when src is provided', () => {
    render(<Avatar src="/photo.jpg" alt="Jane Doe" />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Jane Doe');
  });

  it('renders initials when provided', () => {
    render(<Avatar initials="JD" alt="Jane Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it.each(['sm', 'md', 'lg', 'xl'] as const)('applies the %s size class', (size) => {
    const { container } = render(<Avatar size={size} initials="A" />);
    expect(container.firstChild).toHaveClass(`mizu-avatar--${size}`);
  });

  it('forwards className', () => {
    const { container } = render(<Avatar className="custom" initials="X" />);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Avatar src="/photo.jpg" alt="User avatar" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
