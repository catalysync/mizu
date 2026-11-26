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

  it('applies the md size by default', () => {
    render(<Badge>M</Badge>);
    expect(screen.getByText('M')).toHaveAttribute('data-size', 'md');
  });

  // -- Count accessibility --
  it('puts the count and its label into the accessible name', () => {
    render(<Badge count={3} label="unread messages" />);
    expect(screen.getByRole('img', { name: '3 unread messages' })).toBeInTheDocument();
  });

  it('uses the overflowed count in the accessible name', () => {
    render(<Badge count={150} maxCount={99} label="unread messages" />);
    expect(screen.getByRole('img', { name: '99+ unread messages' })).toBeInTheDocument();
  });

  it('uses the bare count as the accessible name when no label is given', () => {
    render(<Badge count={8} />);
    expect(screen.getByRole('img', { name: '8' })).toBeInTheDocument();
  });

  it('does not add an image role to text badges', () => {
    render(<Badge>Active</Badge>);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  // -- Dot appearance --
  it('renders a dot appearance with no visible text', () => {
    const { container } = render(<Badge appearance="dot" tone="success" />);
    const badge = container.querySelector('.mizu-badge');
    expect(badge).toHaveAttribute('data-appearance', 'dot');
    expect(badge).toBeEmptyDOMElement();
  });

  it('keeps the dot appearance label as screen-reader text', () => {
    const { container } = render(
      <Badge appearance="dot" tone="danger">
        Offline
      </Badge>,
    );
    expect(screen.getByText('Offline')).toHaveClass('mizu-sr-only');
    expect(container.querySelector('.mizu-badge')).toHaveAttribute('data-appearance', 'dot');
  });

  it('does not set data-appearance by default', () => {
    render(<Badge>Text</Badge>);
    expect(screen.getByText('Text')).not.toHaveAttribute('data-appearance');
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

  it('has no axe violations (counter with label)', async () => {
    const { container } = render(<Badge count={42} label="open tasks" tone="danger" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (dot appearance)', async () => {
    const { container } = render(
      <Badge appearance="dot" tone="warning">
        Degraded
      </Badge>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
