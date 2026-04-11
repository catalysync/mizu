'use client';

import { Stack } from '@aspect/react';
import { Box, Eye, FileCode, Layers, Palette, Zap } from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Every semantic token',
    body: 'Action, feedback, surface, text, border — every token the mizu design system exposes is editable.',
  },
  {
    icon: Eye,
    title: 'Live preview',
    body: 'Edits apply instantly to real mizu components — buttons, cards, tables, forms, alerts, and more.',
  },
  {
    icon: Box,
    title: '26 built-in themes',
    body: 'Every identity theme that ships with mizu (atlas, bold, minimal, sage, neon…) is loadable as a preset.',
  },
  {
    icon: Layers,
    title: 'Radius, shadow, motion',
    body: 'Tune geometry and motion alongside colors. The whole mizu token surface, not just palette.',
  },
  {
    icon: FileCode,
    title: 'Plain CSS output',
    body: 'Export a single block of --mizu-* custom properties scoped to :root or a data-attribute selector.',
  },
  {
    icon: Zap,
    title: 'No account, no build',
    body: 'Everything runs in your browser. State persists locally. Paste the CSS and you are done.',
  },
];

export function Features() {
  return (
    <section
      id="features"
      style={{
        position: 'relative',
        padding: '6rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gap: '3rem',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
            alignItems: 'start',
          }}
          className="features__grid"
        >
          <Stack gap="1rem">
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                color: 'var(--mizu-action-primary-default)',
              }}
            >
              Features
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--mizu-text-primary)',
              }}
            >
              Everything the design system exposes —
              <br />
              <span style={{ color: 'var(--mizu-text-secondary)' }}>now tweakable.</span>
            </h2>
            <p
              style={{
                margin: 0,
                color: 'var(--mizu-text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.6,
                maxWidth: '24rem',
              }}
            >
              tweakmizu gives you direct control of the same {`--mizu-*`} tokens that{' '}
              <code
                style={{
                  fontFamily: 'var(--mizu-font-family-mono)',
                  fontSize: '0.85em',
                  background: 'var(--mizu-surface-secondary)',
                  padding: '0.125rem 0.375rem',
                  borderRadius: 'var(--mizu-radius-sm)',
                }}
              >
                @aspect/tokens
              </code>{' '}
              ships to every app in the monorepo.
            </p>
          </Stack>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '1rem',
            }}
            className="features__list"
          >
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--mizu-radius-lg)',
                  border: '1px solid var(--mizu-border-default)',
                  background: 'var(--mizu-surface-default)',
                  transition:
                    'transform var(--mizu-duration-fast), border-color var(--mizu-duration-fast), box-shadow var(--mizu-duration-fast)',
                }}
                className="feature-card"
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--mizu-radius-md)',
                    background:
                      'color-mix(in srgb, var(--mizu-action-primary-default) 10%, transparent)',
                    color: 'var(--mizu-action-primary-default)',
                    marginBottom: '0.875rem',
                  }}
                >
                  <Icon size={20} />
                </div>
                <h3
                  style={{
                    margin: '0 0 0.375rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--mizu-text-primary)',
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--mizu-text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.55,
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
