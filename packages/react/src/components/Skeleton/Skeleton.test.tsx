import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders with aria-hidden', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['text', 'heading', 'circle', 'button'] as const)(
    'applies the %s variant class',
    (variant) => {
      const { container } = render(<Skeleton variant={variant} />);
      expect(container.firstChild).toHaveClass(`mizu-skeleton--${variant}`);
    },
  );

  it('applies custom width and height', () => {
    const { container } = render(<Skeleton width={200} height={20} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('20px');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Skeleton variant="text" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
