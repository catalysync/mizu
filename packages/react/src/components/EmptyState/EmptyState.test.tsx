import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders a title', () => {
    render(<EmptyState title="No results" />);
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('renders a description', () => {
    render(<EmptyState title="No results" description="Try a different filter." />);
    expect(screen.getByText('Try a different filter.')).toBeInTheDocument();
  });

  it('renders actions as ReactNode', () => {
    render(<EmptyState title="Empty" actions={<button>Create item</button>} />);
    expect(screen.getByRole('button', { name: 'Create item' })).toBeInTheDocument();
  });

  it('renders an icon', () => {
    render(<EmptyState title="Empty" icon={<span data-testid="icon">📦</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies the mizu-empty-state class', () => {
    const { container } = render(<EmptyState title="Empty" />);
    expect(container.querySelector('.mizu-empty-state')).toBeInTheDocument();
  });

  it('renders title in an h2', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.getByText('Empty').tagName).toBe('H2');
  });

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="X" />);
    expect(container.querySelector('.mizu-empty-state__description')).toBeNull();
  });

  it('does not render actions when not provided', () => {
    const { container } = render(<EmptyState title="X" />);
    expect(container.querySelector('.mizu-empty-state__actions')).toBeNull();
  });

  it('merges custom className', () => {
    const { container } = render(<EmptyState title="X" className="custom" />);
    expect(container.querySelector('.mizu-empty-state')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<EmptyState ref={ref} title="X" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <EmptyState title="Nothing here" description="Create your first item." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (with actions)', async () => {
    const { container } = render(<EmptyState title="No items" actions={<button>Add</button>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
