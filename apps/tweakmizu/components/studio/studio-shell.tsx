'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stack } from '@aspect/react';
import { FileStack, LayoutGrid, Sliders, Sparkles, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
  match: (pathname: string) => boolean;
}

const NAV: NavItem[] = [
  {
    href: '/studio',
    label: 'Home',
    icon: Home,
    match: (p) => p === '/studio',
  },
  {
    href: '/studio/new',
    label: 'New project',
    icon: Sparkles,
    match: (p) => p.startsWith('/studio/new'),
  },
  {
    href: '/dashboard',
    label: 'Projects',
    icon: FileStack,
    match: (p) => p.startsWith('/dashboard') || /^\/studio\/[^/]+$/.test(p),
  },
  {
    href: '/studio/catalog',
    label: 'Catalog',
    icon: LayoutGrid,
    match: (p) => p.startsWith('/studio/catalog'),
  },
  {
    href: '/studio/editor',
    label: 'Editor',
    icon: Sliders,
    match: (p) => p.startsWith('/studio/editor'),
  },
];

export function StudioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-[12rem_1fr] gap-8 px-4 py-8 md:py-10">
      <nav aria-label="Studio navigation" className="sticky top-20 h-fit">
        <Stack gap="0.25rem">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Studio
          </span>
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </Stack>
      </nav>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
