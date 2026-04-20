'use client';

import { cn } from '@/utils/cn';
import { Stack } from '@aspect/react';
import { FileStack, Home, LayoutGrid, Menu, Sliders, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile navigation)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar on escape key
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  const navContent = (
    <Stack gap="0.25rem">
      <span className="text-muted-foreground px-3 py-1 text-xs font-semibold tracking-wider uppercase">
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
  );

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[12rem_1fr] md:py-10">
      {/* Mobile hamburger toggle */}
      <div className="flex items-center md:hidden">
        <button
          type="button"
          aria-label={sidebarOpen ? 'Close studio menu' : 'Open studio menu'}
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((v) => !v)}
          className="text-muted-foreground hover:bg-muted/70 hover:text-foreground inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          Studio menu
        </button>
      </div>

      {/* Mobile overlay sidebar */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <nav
            aria-label="Studio navigation"
            className="border-border bg-background fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto border-r px-4 py-8 md:hidden"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-foreground text-sm font-semibold">Studio</span>
              <button
                type="button"
                aria-label="Close studio menu"
                onClick={() => setSidebarOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-md p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {navContent}
          </nav>
        </>
      )}

      {/* Desktop sidebar */}
      <nav aria-label="Studio navigation" className="sticky top-20 hidden h-fit md:block">
        {navContent}
      </nav>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
