'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@aspect/react';

const items = [
  {
    q: 'What is tweakmizu?',
    a: 'A browser-based editor for the mizu design system. Pick a preset, tweak tokens, preview on real mizu components, and export the CSS to drop into your project.',
  },
  {
    q: 'How is this different from a Figma plugin?',
    a: 'It runs on the same --mizu-* custom properties your app already uses at runtime. What you see in the preview is literally the tokens your CSS references — no design tool abstraction in between.',
  },
  {
    q: 'Where does my work live?',
    a: 'Locally, in your browser. tweakmizu persists state in localStorage. There are no accounts, no servers, and nothing gets uploaded.',
  },
  {
    q: 'Can I theme the whole design system from here?',
    a: 'Yes. Every semantic token in @aspect/tokens is editable — action, feedback, surface, text, border, plus radius, shadow, typography, and motion.',
  },
  {
    q: 'What does the exported CSS look like?',
    a: 'A single block of --mizu-* custom properties, scoped to either :root or a [data-mizu-identity="your-theme"] selector so it sits cleanly alongside the stock mizu tokens.',
  },
  {
    q: 'Does it work with Tailwind v4?',
    a: 'Yes — mizu itself bridges to Tailwind v4 via @theme. Any theme you export from tweakmizu will flow through that bridge unchanged.',
  },
];

export function FAQ() {
  return (
    <section id="faq" style={{ padding: '6rem 1.5rem' }}>
      <div
        style={{
          maxWidth: '72rem',
          margin: '0 auto',
          display: 'grid',
          gap: '3rem',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
          alignItems: 'start',
        }}
        className="faq__grid"
      >
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              color: 'var(--mizu-action-primary-default)',
            }}
          >
            FAQ
          </span>
          <h2
            style={{
              margin: '0.75rem 0 0.75rem',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--mizu-text-primary)',
            }}
          >
            Common questions.
          </h2>
          <p
            style={{
              margin: 0,
              color: 'var(--mizu-text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            Not finding what you need? File an issue on the{' '}
            <a
              href="https://github.com/catalysync/mizu/issues"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--mizu-action-primary-default)' }}
            >
              mizu repo
            </a>
            .
          </p>
        </div>

        <Accordion type="single" collapsible>
          {items.map((item, i) => (
            <AccordionItem key={i} value={`q-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
