'use client';

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
    <section id="features" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="features__grid grid items-start gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-4">
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">
              Features
            </span>
            <h2 className="text-foreground m-0 text-4xl leading-[1.1] font-bold tracking-tight md:text-5xl">
              Everything the design system exposes —
              <br />
              <span className="text-muted-foreground">now tweakable.</span>
            </h2>
            <p className="text-muted-foreground m-0 max-w-sm text-base leading-relaxed">
              tweakmizu gives you direct control of the same{' '}
              <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.85em]">
                --mizu-*
              </code>{' '}
              tokens that{' '}
              <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.85em]">
                @aspect/tokens
              </code>{' '}
              ships to every app in the monorepo.
            </p>
          </div>

          <div className="features__list grid gap-4 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="feature-card border-border bg-background rounded-lg border p-6 transition-all"
              >
                <div className="bg-primary/10 text-primary mb-3.5 inline-flex size-10 items-center justify-center rounded-md">
                  <Icon size={20} />
                </div>
                <h3 className="text-foreground mb-1.5 text-base font-semibold">{title}</h3>
                <p className="text-muted-foreground m-0 text-sm leading-[1.55]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
