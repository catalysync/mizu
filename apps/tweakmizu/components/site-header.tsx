'use client';

import { Button } from '@aspect/react';
import { ChevronRight, Github, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { ThemeToggle } from './theme-toggle';

const nav = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const id = e.currentTarget.getAttribute('href')?.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full backdrop-blur-lg transition-colors',
        scrolled
          ? 'border-b border-border bg-background/90'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-foreground no-underline"
        >
          <span
            aria-hidden="true"
            className="inline-block size-6 rounded-md bg-gradient-to-br from-primary to-success"
          />
          tweakmizu
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleAnchor}
              className="text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com/catalysync/mizu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Mizu on GitHub"
            className="hidden md:inline-flex"
          >
            <Button variant="ghost" size="icon">
              <Github size={18} />
            </Button>
          </a>
          <Link href="/editor" className="hidden md:block">
            <Button variant="primary">
              Open Editor <ChevronRight size={16} className="ml-1" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-3 border-t border-border bg-background px-6 py-4 md:hidden">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleAnchor}
              className="text-sm text-foreground no-underline"
            >
              {item.label}
            </a>
          ))}
          <Link href="/editor" className="mt-1">
            <Button variant="primary" className="w-full">
              Open Editor <ChevronRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
