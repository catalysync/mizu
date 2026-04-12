import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders with text content', () => {
    render(<Tag>Feature</Tag>);
    expect(screen.getByText('Feature')).toBeInTheDocument();
  });

  it('applies the mizu-tag base class', () => {
    const { container } = render(<Tag>X</Tag>);
    expect(container.firstChild).toHaveClass('mizu-tag');
  });

  it('applies the neutral tone by default', () => {
    const { container } = render(<Tag>X</Tag>);
    expect(container.firstChild).toHaveClass('mizu-tag--neutral');
  });

  it('applies the success tone', () => {
    const { container } = render(<Tag tone="success">Active</Tag>);
    expect(container.firstChild).toHaveClass('mizu-tag--success');
  });

  it('applies the warning tone', () => {
    const { container } = render(<Tag tone="warning">Pending</Tag>);
    expect(container.firstChild).toHaveClass('mizu-tag--warning');
  });

  it('applies the danger tone', () => {
    const { container } = render(<Tag tone="danger">Error</Tag>);
    expect(container.firstChild).toHaveClass('mizu-tag--danger');
  });

  it('renders a remove button when onDismiss is provided', () => {
    render(<Tag onDismiss={() => {}}>X</Tag>);
    expect(screen.getByLabelText(/remove/i)).toBeInTheDocument();
  });

  it('fires onDismiss when remove button clicked', () => {
    const onDismiss = vi.fn();
    render(<Tag onDismiss={onDismiss}>Bug</Tag>);
    fireEvent.click(screen.getByLabelText(/remove/i));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('does not show remove button without onDismiss', () => {
    render(<Tag>Feature</Tag>);
    expect(screen.queryByLabelText(/remove/i)).not.toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<Tag className="custom">X</Tag>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Tag ref={ref}>X</Tag>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Tag>Feature</Tag>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (removable)', async () => {
    const { container } = render(<Tag onDismiss={() => {}}>Bug</Tag>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
