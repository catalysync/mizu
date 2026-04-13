'use client';

import './craft-shell.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Undo2, Redo2, Download, Settings } from 'lucide-react';
import { Button, cn } from '@aspect/react';
import { useCraftStore } from '@/store/craft-store';
import { installPreviewPublisher } from './preview/preview-bridge';
import { CraftProProvider } from './craft-pro-context';
import { ProBanner, ProBadge } from './pro-upsell';
import { HydrationGate } from './hydration-gate';
import { PreviewDock } from './preview-dock';
import { ThemeToggle } from '@/components/theme-toggle';

interface CraftShellProps {
  user: { id: string; name: string; email: string };
  isPro?: boolean;
  children: React.ReactNode;
}

const NAV_SECTIONS: Array<{
  heading: string;
  items: Array<{ href: string; label: string; hint?: string }>;
}> = [
  {
    heading: 'Start',
    items: [
      { href: '/craft', label: 'Presets', hint: 'archetypes + onboarding' },
      { href: '/craft/prompt', label: 'AI prompt', hint: 'describe it in words' },
    ],
  },
  {
    heading: 'Knobs',
    items: [
      { href: '/craft/foundation', label: 'Foundation', hint: 'hue, chroma, contrast' },
      { href: '/craft/shape', label: 'Shape', hint: 'radius, border, chrome' },
      { href: '/craft/density', label: 'Density', hint: 'spacing + rhythm' },
      { href: '/craft/type', label: 'Type', hint: 'family + scale' },
      { href: '/craft/motion', label: 'Motion', hint: 'easing + duration' },
      { href: '/craft/depth', label: 'Depth', hint: 'shadows + layering' },
      { href: '/craft/focus', label: 'Focus', hint: 'ring style + color' },
      { href: '/craft/iconography', label: 'Iconography', hint: 'stroke + style' },
      { href: '/craft/voice', label: 'Voice', hint: 'register + error tone' },
      { href: '/craft/opinions', label: 'API opinions', hint: 'prop naming' },
    ],
  },
  {
    heading: 'Ship',
    items: [
      { href: '/preview', label: 'Preview', hint: 'see it assembled' },
      { href: '/craft/export', label: 'Export', hint: 'CSS, JSON, starter' },
      { href: '/craft/gallery', label: 'Gallery', hint: 'community profiles' },
    ],
  },
];

export function CraftShell({ user, isPro = false, children }: CraftShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const undo = useCraftStore((s) => s.undo);
  const redo = useCraftStore((s) => s.redo);
  const canUndo = useCraftStore((s) => s.history.length > 0);
  const canRedo = useCraftStore((s) => s.future.length > 0);
  const profileName = useCraftStore((s) => s.profile.name);

  // Broadcast profile changes to any iframe preview windows under the same origin
  useEffect(() => {
    return installPreviewPublisher();
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Escape key closes mobile drawer
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <CraftProProvider isPro={isPro}>
      <div className="craft-shell">
        <header className="craft-shell__header">
          <button
            type="button"
            className="craft-shell__menu-btn"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            aria-controls="craft-nav"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/craft" className="craft-shell__brand">
            <span className="craft-shell__brand-mark">✷</span>
            <span className="craft-shell__brand-text">craft</span>
            {isPro ? <ProBadge /> : null}
            <span className="craft-shell__profile-name">{profileName}</span>
          </Link>
          <div className="craft-shell__header-actions">
            <ThemeToggle size="sm" />
            <Button size="sm" variant="ghost" disabled={!canUndo} onClick={undo} aria-label="Undo">
              <Undo2 size={16} />
            </Button>
            <Button size="sm" variant="ghost" disabled={!canRedo} onClick={redo} aria-label="Redo">
              <Redo2 size={16} />
            </Button>
            <Button asChild size="sm" variant="primary">
              <Link href="/craft/export">
                <Download size={16} />
                <span className="craft-shell__export-label">Export</span>
              </Link>
            </Button>
          </div>
        </header>

        <div className="craft-shell__body">
          <nav
            id="craft-nav"
            className="craft-shell__nav"
            data-mobile-open={mobileOpen || undefined}
            aria-label="Craft sections"
          >
            <div className="craft-shell__nav-inner">
              {NAV_SECTIONS.map((section) => (
                <div key={section.heading} className="craft-shell__nav-section">
                  <div className="craft-shell__nav-heading">{section.heading}</div>
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'craft-shell__nav-item',
                        pathname === item.href && 'craft-shell__nav-item--active',
                      )}
                    >
                      <span className="craft-shell__nav-label">{item.label}</span>
                      {item.hint ? (
                        <span className="craft-shell__nav-hint">{item.hint}</span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              ))}
              <ProBanner />
            </div>
            <div className="craft-shell__nav-footer">
              <div className="craft-shell__user-info">
                <div className="craft-shell__user-name">{user.name}</div>
                <div className="craft-shell__user-email">{user.email}</div>
              </div>
              <Link href="/settings" className="craft-shell__settings-link" aria-label="Settings">
                <Settings size={14} />
              </Link>
            </div>
          </nav>
          {mobileOpen ? (
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              className="craft-shell__backdrop"
              onClick={() => setMobileOpen(false)}
            />
          ) : null}

          <main className="craft-shell__main" id="craft-main">
            <HydrationGate>{children}</HydrationGate>
          </main>
          {pathname !== '/craft' && pathname !== '/craft/export' && (
            <aside className="craft-shell__preview" aria-label="Live preview">
              <PreviewDock />
            </aside>
          )}
        </div>
      </div>
    </CraftProProvider>
  );
}
