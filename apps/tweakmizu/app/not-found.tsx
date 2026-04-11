import { Button } from '@aspect/react';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', minHeight: '100dvh', flexDirection: 'column' }}>
      <SiteHeader />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: '6rem',
            fontWeight: 800,
            lineHeight: 1,
            color: 'color-mix(in srgb, var(--mizu-text-secondary) 25%, transparent)',
            letterSpacing: '-0.04em',
          }}
        >
          404
        </span>
        <h1
          style={{
            margin: '1rem 0 0.5rem',
            fontSize: '1.875rem',
            fontWeight: 700,
            color: 'var(--mizu-text-primary)',
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: '28rem',
            color: 'var(--mizu-text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.6,
          }}
        >
          The page you are looking for does not exist or has moved. Head back to the landing page or
          jump straight into the editor.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
          <Link href="/">
            <Button variant="secondary">Back to home</Button>
          </Link>
          <Link href="/editor">
            <Button>Open editor</Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
