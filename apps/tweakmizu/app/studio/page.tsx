import { Button } from '@aspect/react';
import { ArrowRight, Sliders, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function StudioHome() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-5xl px-4 py-16 md:py-24">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Studio
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                Describe the product.
                <br />
                Pick the industry.
                <br />
                Get the design system.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                A running starter with layout primitives, design tokens, and real patterns. Free
                forever for the first three industries.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="primary" size="lg">
                <Link href="/studio/new">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate a project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/studio/editor">
                  <Sliders className="mr-2 h-4 w-4" />
                  Open the editor
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
