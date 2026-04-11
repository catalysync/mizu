import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Badge, Stack } from '@aspect/react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { db } from '@/db';
import { share } from '@/db/schema';
import type { Plan } from '@/lib/studio/composer';
import { SharedPlanView } from './shared-plan-view';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ token: string }>;
}

async function loadShare(token: string) {
  try {
    const rows = await db.select().from(share).where(eq(share.token, token)).limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function SharePage({ params }: Props) {
  const { token } = await params;
  const row = await loadShare(token);

  if (!row) {
    notFound();
  }

  const plan = row.planJson as Plan;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-5xl px-4 py-10">
          <Stack gap="1.5rem">
            <Stack gap="0.5rem">
              <Badge tone="info">Shared project</Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {plan.intent.productName}
              </h1>
              <p className="text-lg text-muted-foreground">{plan.intent.description}</p>
            </Stack>
            <SharedPlanView plan={plan} />
          </Stack>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
