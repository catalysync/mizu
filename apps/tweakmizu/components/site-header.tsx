'use client';

import { Button } from '@aspect/react';
import { ChevronRight, Github, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: scrolled
          ? 'color-mix(in srgb, var(--mizu-surface-default) 90%, transparent)'
          : 'transparent',
        borderBottom: scrolled ? '1px solid var(--mizu-border-default)' : '1px solid transparent',
        transition: 'background var(--mizu-duration-fast), border var(--mizu-duration-fast)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4rem',
          padding: '0 1.5rem',
          maxWidth: '80rem',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--mizu-text-primary)',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '1.125rem',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: 'var(--mizu-radius-md)',
              background:
                'linear-gradient(135deg, var(--mizu-action-primary-default), var(--mizu-feedback-success-default))',
            }}
          />
          tweakmizu
        </Link>

        <nav
          style={{
            display: 'flex',
            gap: '2rem',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          className="site-header__nav"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleAnchor}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--mizu-text-secondary)',
                textDecoration: 'none',
                transition: 'color var(--mizu-duration-fast)',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          className="site-header__actions"
        >
          <Button variant="ghost" size="icon" asChild aria-label="Mizu on GitHub">
            <a href="https://github.com/catalysync/mizu" target="_blank" rel="noopener noreferrer">
              <Github size={18} />
            </a>
          </Button>
          <Link href="/editor">
            <Button variant="primary">
              Open Editor <ChevronRight size={16} style={{ marginLeft: 4 }} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="site-header__menu-toggle"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="site-header__mobile"
          style={{
            borderTop: '1px solid var(--mizu-border-default)',
            background: 'var(--mizu-surface-default)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleAnchor}
              style={{
                color: 'var(--mizu-text-primary)',
                textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
