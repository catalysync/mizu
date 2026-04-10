import Link from 'next/link';

const pillars = [
  {
    title: 'Foundation',
    description: 'Design tokens for colors, typography, spacing, shadows, and motion.',
    href: '/foundation/colors',
  },
  {
    title: 'Components',
    description: '20+ React components with Radix primitives, vitest-axe tested.',
    href: '/components/button',
  },
  {
    title: 'Layouts',
    description: 'Stack, Inline, Grid, Split, Center, Cluster — composable primitives.',
    href: '/layouts/stack',
  },
  {
    title: 'App Shell',
    description: 'Header, Sidebar, Content, Breadcrumbs — build any admin layout.',
    href: '/shell/app-layout',
  },
  {
    title: '@aspect/finance',
    description: 'KPI cards, deltas, report tables, annotation cards for fintech.',
    href: '/packages/finance',
  },
  {
    title: '@aspect/commerce',
    description: 'Thumbnails, pagination, banners, resource items for storefronts.',
    href: '/packages/tailwind-preset',
  },
];

export default function HomePage() {
  return (
    <div className="docs-home">
      <div className="docs-home__hero">
        <h1 className="docs-home__title">mizu</h1>
        <p className="docs-subtitle">
          An open-source design system for building consistent interfaces across any framework. Ship
          tokens, CSS, and React components from one monorepo.
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
        {pillars.map((p) => (
          <Link key={p.title} href={p.href} className="docs-home__card">
            <h3 className="docs-home__card-title">{p.title}</h3>
            <p className="docs-home__card-desc">{p.description}</p>
          </Link>
        ))}
      </div>

      <div className="docs-home__install">
        <h2>Quick install</h2>
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
