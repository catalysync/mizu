import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { AppBreadcrumbs } from '../../shell/AppBreadcrumbs';
import { Breadcrumb } from './Breadcrumb';

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
    expect(screen.queryByText('Widget')?.closest('a')).toBeNull();
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

  it('uses an ordered list with one listitem per crumb', () => {
    render(<AppBreadcrumbs items={items} />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
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

  describe('maxVisible overflow', () => {
    const long = ['A', 'B', 'C', 'D', 'E', 'F'].map((label) => ({ label, href: `/${label}` }));

    it('collapses the middle items into an ellipsis', () => {
      const { container } = render(<AppBreadcrumbs items={long} maxVisible={3} />);
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.queryByText('B')).not.toBeInTheDocument();
      expect(screen.queryByText('C')).not.toBeInTheDocument();
      expect(screen.queryByText('D')).not.toBeInTheDocument();
      expect(screen.getByText('E')).toBeInTheDocument();
      expect(screen.getByText('F').closest('[aria-current]')).toHaveAttribute(
        'aria-current',
        'page',
      );
      // three crumbs plus the overflow item
      expect(screen.getAllByRole('listitem')).toHaveLength(4);
      expect(container.querySelector('.mizu-app-breadcrumbs__overflow')).toHaveTextContent('…');
      expect(screen.getByText('3 more levels')).toHaveClass('mizu-sr-only');
    });

    it('does not collapse when the item count fits', () => {
      render(<AppBreadcrumbs items={long} maxVisible={6} />);
      expect(screen.getAllByRole('listitem')).toHaveLength(6);
      expect(screen.queryByText('…')).not.toBeInTheDocument();
    });

    it('treats maxVisible below 2 as 2', () => {
      render(<AppBreadcrumbs items={long} maxVisible={0} />);
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('F')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('has no axe violations when collapsed', async () => {
      const { container } = render(<AppBreadcrumbs items={long} maxVisible={3} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe('Breadcrumb (deprecated span family)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('warns in development that the span family is deprecated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Breadcrumb>
        <span>Home</span>
      </Breadcrumb>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Breadcrumb is deprecated'));
  });
});
