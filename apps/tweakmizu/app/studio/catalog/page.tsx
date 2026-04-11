import Link from 'next/link';
import { Button } from '@aspect/react';
import { ArrowLeft } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { CatalogBrowser } from './catalog-browser';

export const metadata = {
  title: 'Pattern catalog — tweakmizu studio',
  description:
    'Browse the free-tier pattern catalog: real patterns mined from mizu storybook demos and attributed to source design systems.',
};

export default function StudioCatalog() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="flex flex-col gap-8">
            <Button asChild variant="ghost" size="sm" className="self-start">
              <Link href="/studio">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to studio
              </Link>
            </Button>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Catalog
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                Patterns available in the studio
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Each pattern is a re-implementation on top of <code>@aspect/react</code>, grounded
                in an attributed source. The free tier ships these; Pro unlocks the full catalog.
              </p>
            </div>

            <CatalogBrowser />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
