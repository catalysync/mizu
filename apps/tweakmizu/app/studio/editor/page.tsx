import Link from 'next/link';
import { Button, Stack } from '@aspect/react';
import { ArrowLeft } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function StudioEditor() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 py-16">
          <Stack gap="1.5rem">
            <Button asChild variant="ghost" size="sm" className="self-start">
              <Link href="/studio">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to studio
              </Link>
            </Button>

            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Studio editor
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              The deeper mizu-focused editor. Color, typography, layout primitives, density, motion,
              a11y, component overrides, patterns. The legacy editor at{' '}
              <Link href="/editor" className="underline">
                /editor
              </Link>{' '}
              stays exactly where it is.
            </p>

            <div className="rounded-lg border border-dashed border-border p-8">
              <p className="text-sm text-muted-foreground">
                Tab rail + preview iframe + knob panel are scaffolded in follow-up commits.
              </p>
            </div>
          </Stack>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
