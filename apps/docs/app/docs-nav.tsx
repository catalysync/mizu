'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const nav: NavSection[] = [
  {
    title: 'Get started',
    items: [
      { label: 'Introduction', href: '/' },
      { label: 'Installation', href: '/getting-started' },
    ],
  },
  {
    title: 'Foundation',
    items: [
      { label: 'Colors', href: '/foundation/colors' },
      { label: 'Typography', href: '/foundation/typography' },
      { label: 'Spacing', href: '/foundation/spacing' },
    ],
  },
  {
    title: 'General',
    items: [
      { label: 'Button', href: '/components/button' },
      { label: 'Badge', href: '/components/badge' },
      { label: 'Card', href: '/components/card' },
      { label: 'Separator', href: '/components/separator' },
      { label: 'EmptyState', href: '/components/empty-state' },
    ],
  },
  {
    title: 'Form controls',
    items: [
      { label: 'Input', href: '/components/input' },
      { label: 'Textarea', href: '/components/textarea' },
      { label: 'Select', href: '/components/select' },
      { label: 'Checkbox', href: '/components/checkbox' },
      { label: 'Radio', href: '/components/radio' },
      { label: 'Switch', href: '/components/switch' },
    ],
  },
  {
    title: 'Data display',
    items: [
      { label: 'Table', href: '/components/table' },
      { label: 'Tabs', href: '/components/tabs' },
    ],
  },
  {
    title: 'Filtering',
    items: [
      { label: 'Overview', href: '/filtering/overview' },
      { label: 'FilterBar', href: '/filtering/filter-bar' },
      { label: 'PropertyFilter', href: '/filtering/property-filter' },
      { label: 'QueryBuilder', href: '/filtering/query-builder' },
      { label: 'AdvancedQueryBuilder', href: '/filtering/advanced-query-builder' },
    ],
  },
  {
    title: 'Overlays',
    items: [
      { label: 'Modal', href: '/components/modal' },
      { label: 'Drawer', href: '/components/drawer' },
      { label: 'Popover', href: '/components/popover' },
      { label: 'Tooltip', href: '/components/tooltip' },
      { label: 'DropdownMenu', href: '/components/dropdown-menu' },
    ],
  },
  {
    title: 'Layouts',
    items: [
      { label: 'Stack', href: '/layouts/stack' },
      { label: 'Inline', href: '/layouts/inline' },
      { label: 'Grid', href: '/layouts/grid' },
      { label: 'Split', href: '/layouts/split' },
      { label: 'Center', href: '/layouts/center' },
      { label: 'Cluster', href: '/layouts/cluster' },
    ],
  },
  {
    title: 'App shell',
    items: [
      { label: 'AppLayout', href: '/shell/app-layout' },
      { label: 'AppHeader', href: '/shell/app-header' },
      { label: 'AppSidebar', href: '/shell/app-sidebar' },
      { label: 'AppContent', href: '/shell/app-content' },
      { label: 'AppBreadcrumbs', href: '/shell/app-breadcrumbs' },
    ],
  },
  {
    title: 'Packages',
    items: [
      { label: '@aspect/finance', href: '/packages/finance' },
      { label: 'Tailwind preset', href: '/packages/tailwind-preset' },
    ],
  },
];

export function DocsNav() {
  const pathname = usePathname();

  return (
    <nav className="docs-nav" aria-label="Documentation">
      {nav.map((section) => (
        <div key={section.title} className="docs-nav__section">
          <div className="docs-nav__section-title">{section.title}</div>
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`docs-nav__link ${pathname === item.href ? 'docs-nav__link--active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
