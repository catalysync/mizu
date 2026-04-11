'use client';

import { Button, Cluster } from '@aspect/react';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 1.5rem',
        background:
          'linear-gradient(135deg, var(--mizu-action-primary-default), color-mix(in srgb, var(--mizu-action-primary-default) 70%, var(--mizu-feedback-success-default)))',
        color: 'var(--mizu-text-inverse)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse at center, #000 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, #000 40%, transparent 80%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          maxWidth: '48rem',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          Your theme, one tab away.
        </h2>
        <p
          style={{
            margin: '1.25rem auto 0',
            maxWidth: '32rem',
            fontSize: '1.125rem',
            lineHeight: 1.6,
            opacity: 0.9,
          }}
        >
          Open the editor, adjust whatever feels off, copy the CSS. Your mizu app looks different in
          about 90 seconds.
        </p>
        <Cluster gap="0.75rem" justify="center" style={{ marginTop: '2rem' }}>
          <Link href="/editor">
            <Button size="lg" variant="secondary">
              Open the editor
              <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
            </Button>
          </Link>
          <a
            href="https://github.com/catalysync/mizu"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Button size="lg" variant="ghost" style={{ color: 'var(--mizu-text-inverse)' }}>
              <Github size={16} style={{ marginRight: '0.5rem' }} />
              View mizu on GitHub
            </Button>
          </a>
        </Cluster>
      </div>
    </section>
  );
}
