import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a skeleton element', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('mizu-skeleton');
  });

  it('applies no variant class for rect default', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).not.toHaveClass('mizu-skeleton--text');
  });

  it('applies the circular variant', () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(container.firstChild).toHaveClass('mizu-skeleton--circle');
  });

  it('applies the rectangular variant', () => {
    const { container } = render(<Skeleton variant="text" />);
    expect(container.firstChild).toHaveClass('mizu-skeleton--text');
  });

  it('accepts width as a prop', () => {
    const { container } = render(<Skeleton width="200px" />);
    expect(container.firstChild).toHaveStyle({ width: '200px' });
  });

  it('accepts height as a prop', () => {
    const { container } = render(<Skeleton height="40px" />);
    expect(container.firstChild).toHaveStyle({ height: '40px' });
  });

  it('renders children (used for sizing)', () => {
    render(
      <Skeleton>
        <span>Hidden text</span>
      </Skeleton>,
    );
    expect(screen.getByText('Hidden text')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<Skeleton className="custom" />);
    expect(container.firstChild).toHaveClass('mizu-skeleton');
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies animate by default', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).not.toHaveAttribute('data-animate', 'false');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Skeleton />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (circular)', async () => {
    const { container } = render(<Skeleton variant="circle" width="48px" height="48px" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
