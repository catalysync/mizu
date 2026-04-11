import Link from 'next/link';
import { Github } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--mizu-border-default)',
        background: 'var(--mizu-surface-default)',
      }}
    >
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '2.5rem 1.5rem',
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'minmax(0, 2fr) repeat(2, minmax(0, 1fr))',
        }}
      >
        <div style={{ maxWidth: '28rem' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--mizu-text-primary)',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.125rem',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: 'var(--mizu-radius-md)',
                background:
                  'linear-gradient(135deg, var(--mizu-action-primary-default), var(--mizu-feedback-success-default))',
              }}
            />
            tweakmizu
          </Link>
          <p
            style={{
              marginTop: '0.75rem',
              color: 'var(--mizu-text-secondary)',
              fontSize: '0.875rem',
              lineHeight: 1.6,
            }}
          >
            A visual editor for the mizu design system. Start from a preset, adjust tokens, preview
            in real time, and export the CSS.
          </p>
          <a
            href="https://github.com/catalysync/mizu"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              marginTop: '1rem',
              color: 'var(--mizu-text-secondary)',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            <Github size={16} /> GitHub
          </a>
        </div>

        <FooterGroup
          title="Product"
          items={[
            { label: 'Editor', href: '/editor' },
            { label: 'Features', href: '/#features' },
            { label: 'Themes', href: '/#presets' },
          ]}
        />

        <FooterGroup
          title="Mizu"
          items={[
            { label: 'Docs', href: 'https://docs.mizu.design' },
            { label: 'Storybook', href: 'https://storybook.mizu.design' },
            { label: 'GitHub', href: 'https://github.com/catalysync/mizu' },
          ]}
        />
      </div>

      <div
        style={{
          borderTop: '1px solid var(--mizu-border-default)',
          padding: '1rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '80rem',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            color: 'var(--mizu-text-secondary)',
            fontSize: '0.75rem',
          }}
        >
          <span>© {new Date().getFullYear()} mizu design system</span>
          <Link href="/privacy-policy" style={{ color: 'inherit' }}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4
        style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 600,
          color: 'var(--mizu-text-primary)',
          margin: '0 0 0.75rem',
        }}
      >
        {title}
      </h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              style={{
                color: 'var(--mizu-text-secondary)',
                textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
