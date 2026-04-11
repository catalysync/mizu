'use client';

import Link from 'next/link';
import type { DesignLanguageProfile } from '@/lib/craft/profile';

interface PreviewShellProps {
  profile: DesignLanguageProfile;
  currentPath: string;
  children: React.ReactNode;
}

/**
 * A minimal app shell rendered inside the iframe preview using only the
 * current profile's tokens. Not a mizu AppLayout — deliberately bare so
 * every knob change in the craft studio is visible in the shell chrome too
 * (surface color, border width, type scale, etc.). Ships as raw CSS using
 * the --mizu-* variables already scoped to the preview root.
 */
export function PreviewShell({ profile, currentPath, children }: PreviewShellProps) {
  const primaryNav = profile.app.shell.nav.filter((n) => n.section === 'primary');
  const secondaryNav = profile.app.shell.nav.filter((n) => n.section !== 'primary');

  const findPage = (pageId: string) => profile.app.pages.find((p) => p.id === pageId);

  return (
    <div className="craft-preview-shell">
      <header className="craft-preview-shell__header">
        <div className="craft-preview-shell__brand">
          <span className="craft-preview-shell__logo">{profile.app.identity.logo}</span>
          <span className="craft-preview-shell__brand-name">
            {profile.app.identity.productName}
          </span>
        </div>
        <div className="craft-preview-shell__user">
          <span className="craft-preview-shell__avatar">ay</span>
        </div>
      </header>
      <div className="craft-preview-shell__body">
        <nav className="craft-preview-shell__sidebar" aria-label="Sidebar">
          {primaryNav.length > 0 ? (
            <div className="craft-preview-shell__nav-section">
              {primaryNav.map((item) => {
                const page = findPage(item.pageId);
                if (!page) return null;
                const active = page.path === currentPath;
                return (
                  <PreviewNavLink
                    key={item.pageId}
                    href={`/craft/preview${page.path === '/' ? '' : page.path}`}
                    active={active}
                  >
                    {page.title}
                  </PreviewNavLink>
                );
              })}
            </div>
          ) : null}
          {secondaryNav.length > 0 ? (
            <div className="craft-preview-shell__nav-section craft-preview-shell__nav-section--secondary">
              {secondaryNav.map((item) => {
                const page = findPage(item.pageId);
                if (!page) return null;
                const active = page.path === currentPath;
                return (
                  <PreviewNavLink
                    key={item.pageId}
                    href={`/craft/preview${page.path === '/' ? '' : page.path}`}
                    active={active}
                  >
                    {page.title}
                  </PreviewNavLink>
                );
              })}
            </div>
          ) : null}
        </nav>
        <main className="craft-preview-shell__main">{children}</main>
      </div>
    </div>
  );
}

function PreviewNavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="craft-preview-shell__nav-item" data-active={active || undefined}>
      {children}
    </Link>
  );
}
