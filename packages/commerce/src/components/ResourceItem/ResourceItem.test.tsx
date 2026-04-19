import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResourceItem } from './ResourceItem';

describe('ResourceItem', () => {
  it('renders name and meta', () => {
    render(<ResourceItem name="Classic tee" meta="In stock · 42 variants" />);
    expect(screen.getByText('Classic tee')).toBeInTheDocument();
    expect(screen.getByText('In stock · 42 variants')).toBeInTheDocument();
  });

  it('renders a skeleton when loading', () => {
    render(<ResourceItem name="Classic tee" meta="In stock" loading />);
    expect(screen.queryByText('Classic tee')).not.toBeInTheDocument();
    expect(screen.queryByText('In stock')).not.toBeInTheDocument();
  });

  it('sets aria-busy and default loading label', () => {
    const { container } = render(<ResourceItem name="Classic tee" loading />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('aria-label', 'Loading Classic tee');
  });
});
