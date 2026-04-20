import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { db } from '@/db';
import { team, teamMember } from '@/db/schema';
import { tryGetCurrentUserId } from '@/lib/shared';
import { Badge, Button, Card, CardBody, CardHeader, Inline, Stack } from '@aspect/react';
import { eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TeamClient } from './team-client';

export const metadata = {
  title: 'Team — tweakmizu',
};

export const dynamic = 'force-dynamic';

interface OwnedTeam {
  id: string;
  name: string;
  slug: string;
  role: 'owner' | 'admin' | 'member';
}

async function loadTeams(): Promise<OwnedTeam[]> {
  const userId = await tryGetCurrentUserId().catch(() => null);
  if (!userId) return [];

  try {
    const memberships = await db
      .select({
        team: team,
        role: teamMember.role,
      })
      .from(teamMember)
      .innerJoin(team, eq(team.id, teamMember.teamId))
      .where(eq(teamMember.userId, userId));

    return memberships.map((row) => ({
      id: row.team.id,
      name: row.team.name,
      slug: row.team.slug,
      role: row.role,
    }));
  } catch {
    return [];
  }
}

export default async function TeamPage() {
  const teams = await loadTeams();

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-4 py-10">
          <Stack gap="2rem">
            <Button asChild variant="ghost" size="sm" className="self-start">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>

            <Stack gap="0.5rem">
              <span className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                Team
              </span>
              <h1 className="text-foreground text-3xl font-bold tracking-tight">Team workspace</h1>
              <p className="text-muted-foreground text-lg">
                Share themes, projects, and pattern presets across your team.
              </p>
            </Stack>

            {teams.length === 0 ? (
              <Card>
                <CardHeader
                  title="No teams yet"
                  description="Create a team to share projects, invite members, and bill together."
                />
                <CardBody>
                  <TeamClient existingTeams={teams} />
                </CardBody>
              </Card>
            ) : (
              <Stack gap="1rem">
                {teams.map((t) => (
                  <Card key={t.id}>
                    <CardHeader title={t.name} description={`slug: ${t.slug}`} />
                    <CardBody>
                      <Inline gap="0.5rem" align="center">
                        <Badge tone={t.role === 'owner' ? 'success' : 'info'}>{t.role}</Badge>
                      </Inline>
                    </CardBody>
                  </Card>
                ))}
                <TeamClient existingTeams={teams} />
              </Stack>
            )}
          </Stack>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
