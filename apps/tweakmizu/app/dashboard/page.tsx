import Link from 'next/link';
import { Button, Stack } from '@aspect/react';
import { ArrowLeft } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { DashboardClient } from './dashboard-client';

export const metadata = {
  title: 'Dashboard — tweakmizu',
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-5xl px-4 py-10">
          <Stack gap="2rem">
            <Button asChild variant="ghost" size="sm" className="self-start">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>

            <Stack gap="0.5rem">
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Your generated projects and saved themes live here.
              </p>
            </Stack>

            <DashboardClient />
          </Stack>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
