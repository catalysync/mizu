import Link from 'next/link';
import { Github } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-md">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-foreground no-underline"
          >
            <span
              aria-hidden="true"
              className="inline-block size-6 rounded-md bg-gradient-to-br from-primary to-success"
            />
            tweakmizu
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            A visual editor for the mizu design system. Start from a preset, adjust tokens, preview
            in real time, and export the CSS.
          </p>
          <a
            href="https://github.com/catalysync/mizu"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
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

      <div className="border-t border-border px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} mizu design system</span>
          <Link href="/privacy-policy" className="text-inherit no-underline">
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
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h4>
      <ul className="grid list-none gap-2 p-0 m-0">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
