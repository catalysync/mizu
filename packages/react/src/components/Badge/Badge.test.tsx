import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Badge } from './Badge';

describe('Badge', () => {
  // -- Rendering --
  it('renders with text content', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  // -- Tones --
  it('applies the neutral tone by default', () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('mizu-badge--neutral');
  });

  it('applies the success tone', () => {
    render(<Badge tone="success">Paid</Badge>);
    expect(screen.getByText('Paid')).toHaveClass('mizu-badge--success');
  });

  it('applies the warning tone', () => {
    render(<Badge tone="warning">Pending</Badge>);
    expect(screen.getByText('Pending')).toHaveClass('mizu-badge--warning');
  });

  it('applies the danger tone', () => {
    render(<Badge tone="danger">Overdue</Badge>);
    expect(screen.getByText('Overdue')).toHaveClass('mizu-badge--danger');
  });

  it('applies the info tone', () => {
    render(<Badge tone="info">New</Badge>);
    expect(screen.getByText('New')).toHaveClass('mizu-badge--info');
  });

  // -- Dot --
  it('renders a dot when dot prop is true', () => {
    const { container } = render(<Badge dot>Online</Badge>);
    expect(container.querySelector('.mizu-badge__dot')).toBeInTheDocument();
  });

  it('does not render a dot by default', () => {
    const { container } = render(<Badge>Test</Badge>);
    expect(container.querySelector('.mizu-badge__dot')).toBeNull();
  });

  // -- Counter --
  it('renders a count number', () => {
    render(<Badge count={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('shows overflow when count exceeds maxCount', () => {
    render(<Badge count={150} maxCount={99} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('shows exact count when under maxCount', () => {
    render(<Badge count={5} maxCount={99} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('defaults maxCount to 99', () => {
    render(<Badge count={100} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('renders count=0', () => {
    render(<Badge count={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('sets data-count attribute when count is provided', () => {
    render(<Badge count={5} />);
    expect(screen.getByText('5')).toHaveAttribute('data-count', 'true');
  });

  it('prefers count over children', () => {
    render(<Badge count={7}>Ignored</Badge>);
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.queryByText('Ignored')).not.toBeInTheDocument();
  });

  // -- Sizes --
  it('applies the sm size', () => {
    render(<Badge size="sm">S</Badge>);
    expect(screen.getByText('S')).toHaveAttribute('data-size', 'sm');
  });

  it('applies the lg size', () => {
    render(<Badge size="lg">L</Badge>);
    expect(screen.getByText('L')).toHaveAttribute('data-size', 'lg');
  });

  it('does not set data-size for md (default)', () => {
    render(<Badge>M</Badge>);
    expect(screen.getByText('M')).not.toHaveAttribute('data-size');
  });

  // -- className --
  it('merges custom className', () => {
    render(<Badge className="custom">X</Badge>);
    const badge = screen.getByText('X');
    expect(badge).toHaveClass('mizu-badge');
    expect(badge).toHaveClass('custom');
  });

  // -- Ref --
  it('forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>X</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  // -- a11y --
  it('has no axe violations (text)', async () => {
    const { container } = render(<Badge>Active</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (dot)', async () => {
    const { container } = render(
      <Badge dot tone="success">
        Online
      </Badge>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (counter)', async () => {
    const { container } = render(<Badge count={42} tone="danger" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
