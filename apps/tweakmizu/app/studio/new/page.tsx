import Link from 'next/link';
import { Button, Stack } from '@aspect/react';
import { ArrowLeft } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { StudioNewClient } from './client';

export default function StudioNew() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-4 py-16">
          <Stack gap="1.5rem">
            <Button asChild variant="ghost" size="sm" className="self-start">
              <Link href="/studio">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to studio
              </Link>
            </Button>

            <Stack gap="0.5rem">
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                What are you building?
              </h1>
              <p className="text-lg text-muted-foreground">
                Describe the product, pick an industry and tone, and we&apos;ll compose a starter
                from the pattern catalog.
              </p>
            </Stack>

            <StudioNewClient />
          </Stack>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
