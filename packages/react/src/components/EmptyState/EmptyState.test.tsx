import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No data" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<EmptyState title="Empty" description="Nothing here." />);
    expect(screen.getByText('Nothing here.')).toBeInTheDocument();
  });

  it('renders actions', () => {
    render(<EmptyState title="Empty" actions={<button type="button">Add</button>} />);
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<EmptyState title="Empty" icon={<span data-testid="icon">!</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders without optional props', () => {
    render(<EmptyState title="Just a title" />);
    expect(screen.getByText('Just a title')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<EmptyState title="Empty" description="Try again." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
