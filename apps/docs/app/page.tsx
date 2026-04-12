import Link from 'next/link';

const sections = [
  {
    title: 'Foundation',
    description: 'Colors, typography, spacing, and tokens.',
    href: '/foundation/colors',
  },
  {
    title: 'Components',
    description: 'Buttons, inputs, tables, overlays, and more.',
    href: '/components/button',
  },
  {
    title: 'Layouts',
    description: 'Stack, Inline, Grid, Split, Center, Cluster.',
    href: '/layouts/stack',
  },
  {
    title: 'App Shell',
    description: 'Header, sidebar, content, breadcrumbs.',
    href: '/shell/app-layout',
  },
  {
    title: 'Finance',
    description: 'KPI cards, deltas, reports, annotations.',
    href: '/packages/finance',
  },
  {
    title: 'Commerce',
    description: 'Thumbnails, pagination, banners, resource items.',
    href: '/packages/tailwind-preset',
  },
];

export default function HomePage() {
  return (
    <div className="docs-home">
      <div className="docs-home__hero">
        <img src="/mizu-logo.svg" alt="mizu" className="docs-home__logo" />
        <h1 className="docs-home__title">mizu</h1>
        <p className="docs-subtitle">
          A base layer on top of Radix — tokens, CSS, React bindings, layout primitives, and shell
          composition for building web applications. mizu does not have a design language of its
          own; it&apos;s the canvas, and tweakmizu is where the painting happens.
        </p>
        <div className="docs-home__ctas">
          <Link
            href="/getting-started"
            className="mizu-button mizu-button--primary mizu-button--md"
          >
            Get started
          </Link>
          <Link
            href="https://github.com/catalysync/mizu"
            className="mizu-button mizu-button--secondary mizu-button--md"
            target="_blank"
          >
            GitHub
          </Link>
          <Link
            href="https://mizu-storybook.vercel.app"
            className="mizu-button mizu-button--ghost mizu-button--md"
            target="_blank"
          >
            Storybook
          </Link>
        </div>
      </div>

      <div className="docs-home__grid">
        {sections.map((s) => (
          <Link key={s.title} href={s.href} className="docs-home__card">
            <h3 className="docs-home__card-title">{s.title}</h3>
            <p className="docs-home__card-desc">{s.description}</p>
          </Link>
        ))}
      </div>

      <div className="docs-home__install">
        <h2>Install</h2>
        <pre>
          <code>pnpm add @aspect/react @aspect/css @aspect/tokens</code>
        </pre>
        <pre>
          <code>{`@import "@aspect/tokens/css";\n@import "@aspect/css";`}</code>
        </pre>
        <pre>
          <code>{`import { Button } from "@aspect/react";`}</code>
        </pre>
      </div>
    </div>
  );
}
