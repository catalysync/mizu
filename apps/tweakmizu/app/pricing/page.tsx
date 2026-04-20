import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button, Stack } from '@aspect/react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PricingTable } from './pricing-table';

export const metadata = {
  title: 'Pricing — tweakmizu',
  description:
    'Free forever for the editor and the first three industries. Pro unlocks the full catalog, AI composer, multi-framework export, and more.',
};

export default function PricingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 py-16">
          <Stack gap="2rem">
            <Button asChild variant="ghost" size="sm" className="self-start">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>

            <Stack gap="0.75rem" align="start">
              <span className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                Pricing
              </span>
              <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-5xl">
                Free to start. Pro when you need more.
              </h1>
              <p className="text-muted-foreground max-w-2xl text-lg">
                Free forever: editor, 3 industries, React + HTML export, 5 generations per hour. Pro
                unlocks the full pattern catalog, multi-framework export, AI edit-by-prompt, and
                unlimited projects.
              </p>
            </Stack>

            <PricingTable />
          </Stack>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
