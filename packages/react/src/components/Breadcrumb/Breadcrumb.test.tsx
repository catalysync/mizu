import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { AppBreadcrumbs } from '../../shell/AppBreadcrumbs';

describe('Breadcrumb (AppBreadcrumbs)', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Widget' },
  ];

  it('renders all breadcrumb items', () => {
    render(<AppBreadcrumbs items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Widget')).toBeInTheDocument();
  });

  it('renders links for items with href', () => {
    render(<AppBreadcrumbs items={items} />);
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Products').closest('a')).toHaveAttribute('href', '/products');
  });

  it('renders the last item as text (not a link)', () => {
    render(<AppBreadcrumbs items={items} />);
    expect(screen.queryByText('Widget').closest('a')).toBeNull();
  });

  it('marks the last item as current page', () => {
    render(<AppBreadcrumbs items={items} />);
    expect(screen.getByText('Widget').closest('[aria-current]')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('renders a nav with aria-label', () => {
    render(<AppBreadcrumbs items={items} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('renders a single item without separator', () => {
    const { container } = render(<AppBreadcrumbs items={[{ label: 'Home' }]} />);
    expect(container.querySelectorAll('.mizu-app-breadcrumbs__separator').length).toBe(0);
  });

  it('renders empty when items is empty', () => {
    render(<AppBreadcrumbs items={[]} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<AppBreadcrumbs items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (single item)', async () => {
    const { container } = render(<AppBreadcrumbs items={[{ label: 'Dashboard' }]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
