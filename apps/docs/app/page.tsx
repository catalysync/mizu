import Link from 'next/link';

const pillars = [
  {
    title: 'Foundation',
    description: 'Colors, typography, spacing, and design tokens that define the visual language.',
    href: '/foundation/colors',
  },
  {
    title: 'Components',
    description:
      '20+ accessible React components built on Radix primitives with CSS-first styling.',
    href: '/components/button',
  },
  {
    title: 'Layouts',
    description: 'Composable layout primitives — Stack, Inline, Grid, Split, Center, Cluster.',
    href: '/layouts/stack',
  },
  {
    title: 'Demos',
    description: 'Full-app demos showing mizu in action across cloud, commerce, finance, and more.',
    href: 'https://mizu-storybook.vercel.app',
  },
];

const stats = [
  { value: '20+', label: 'components' },
  { value: '6', label: 'layout primitives' },
  { value: '5', label: 'app shell parts' },
  { value: '6', label: 'industry demos' },
];

export default function HomePage() {
  return (
    <div>
      <div style={{ marginBottom: 'var(--mizu-spacing-12)' }}>
        <h1
          style={{
            fontSize: 'var(--mizu-font-size-4xl)',
            fontWeight: 700,
            marginBottom: 'var(--mizu-spacing-3)',
          }}
        >
          mizu
        </h1>
        <p className="docs-subtitle">
          A token-driven, framework-agnostic design system. Build consistent, composable interfaces
          across React, Vue, Svelte, or plain HTML.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--mizu-spacing-3)',
            marginTop: 'var(--mizu-spacing-6)',
          }}
        >
          <Link
            href="/getting-started"
            className="mizu-button mizu-button--primary mizu-button--md"
          >
            <span className="mizu-button__label">Get started</span>
          </Link>
          <Link
            href="https://mizu-storybook.vercel.app"
            className="mizu-button mizu-button--secondary mizu-button--md"
            target="_blank"
          >
            <span className="mizu-button__label">View Storybook</span>
          </Link>
        </div>
      </div>

      <div className="mizu-grid" style={{ marginBottom: 'var(--mizu-spacing-12)' }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              textAlign: 'center',
              padding: 'var(--mizu-spacing-5)',
              background: 'var(--mizu-surface-secondary)',
              borderRadius: 'var(--mizu-radius-lg)',
            }}
          >
            <div
              style={{
                fontSize: 'var(--mizu-font-size-3xl)',
                fontWeight: 700,
                color: 'var(--mizu-action-primary-default)',
              }}
            >
              {s.value}
            </div>
            <div className="mizu-caption">{s.label}</div>
          </div>
        ))}
      </div>

      <h2>Explore</h2>
      <div className="mizu-grid">
        {pillars.map((p) => (
          <Link key={p.title} href={p.href} className="mizu-card mizu-card--interactive">
            <div className="mizu-card__header">
              <h3 className="mizu-card__title">{p.title}</h3>
              <p className="mizu-card__description">{p.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
