import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Badge, Stack } from '@aspect/react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { db } from '@/db';
import { team, teamInvite } from '@/db/schema';
import { InviteClient } from './invite-client';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ token: string }>;
}

async function loadInvite(token: string) {
  const rows = await db
    .select({
      invite: teamInvite,
      team: team,
    })
    .from(teamInvite)
    .innerJoin(team, eq(team.id, teamInvite.teamId))
    .where(eq(teamInvite.token, token))
    .limit(1);
  return rows[0] ?? null;
}

export default async function InviteAcceptPage({ params }: Props) {
  const { token } = await params;
  const row = await loadInvite(token).catch(() => null);

  if (!row) {
    notFound();
  }

  const expired = row.invite.expiresAt < new Date();
  const accepted = !!row.invite.acceptedAt;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-md px-4 py-16">
          <Stack gap="1.5rem">
            <Stack gap="0.5rem">
              <Badge tone="info">Invitation</Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Join {row.team.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                You&apos;ve been invited as <strong>{row.invite.role}</strong> to the{' '}
                <strong>{row.team.name}</strong> workspace on tweakmizu.
              </p>
            </Stack>
            <InviteClient
              token={token}
              expired={expired}
              accepted={accepted}
              teamName={row.team.name}
            />
          </Stack>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
