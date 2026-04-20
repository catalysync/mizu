import { Github } from 'lucide-react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-md">
          <Link
            href="/"
            className="text-foreground flex items-center gap-2 text-lg font-bold no-underline"
          >
            <span
              aria-hidden="true"
              className="from-primary to-success inline-block size-6 rounded-md bg-gradient-to-br"
            />
            tweakmizu
          </Link>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            A visual editor for the mizu design system. Start from a preset, adjust tokens, preview
            in real time, and export the CSS.
          </p>
          <a
            href="https://github.com/catalysync/mizu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground mt-4 inline-flex items-center gap-1.5 text-sm no-underline transition-colors"
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

      <div className="border-border border-t px-6 py-4">
        <div className="text-muted-foreground mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 text-xs">
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
      <h4 className="text-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
        {title}
      </h4>
      <ul className="m-0 grid list-none gap-2 p-0">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-sm no-underline transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
