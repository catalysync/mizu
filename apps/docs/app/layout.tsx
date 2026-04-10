import type { ReactNode } from 'react';
import Link from 'next/link';
import '@aspect/tokens/css';
import '@aspect/css';
import '@aspect/css/themes/dark';
import './globals.css';
import './docs.css';
import { DocsNav } from './docs-nav';

export const metadata = {
  title: 'mizu — design system',
  description:
    'A token-driven, framework-agnostic design system for building consistent, composable interfaces.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="docs-layout">
          <aside className="docs-sidebar">
            <Link href="/" className="docs-sidebar__header">
              mizu
            </Link>
            <DocsNav />
          </aside>
          <main className="docs-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
