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
    <section id="faq" className="px-6 py-24">
      <div className="faq__grid mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[1fr_2fr]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</span>
          <h2 className="mt-3 mb-3 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl">
            Common questions.
          </h2>
          <p className="m-0 text-base leading-relaxed text-muted-foreground">
            Not finding what you need? File an issue on the{' '}
            <a
              href="https://github.com/catalysync/mizu/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
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
