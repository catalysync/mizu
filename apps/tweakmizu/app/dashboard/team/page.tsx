import Link from 'next/link';
import { Button, Card, CardBody, CardHeader, Inline, Stack } from '@aspect/react';
import { ArrowLeft, Users } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata = {
  title: 'Team — tweakmizu',
};

export default function TeamPage() {
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
              <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Team
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Team workspace</h1>
              <p className="text-lg text-muted-foreground">
                Share themes, projects, and pattern presets across your team. Available on the Team
                tier.
              </p>
            </Stack>

            <Card>
              <CardHeader
                title="You don't have a team yet"
                description="Create a team to share projects, invite members, and bill together."
              />
              <CardBody>
                <Stack gap="1rem">
                  <Inline gap="0.5rem" align="center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Team tier: $39/mo for 3 seats + $12/mo per additional seat
                    </span>
                  </Inline>
                  <Inline gap="0.5rem" align="center">
                    <Button asChild variant="primary">
                      <Link href="/pricing">Upgrade to Team</Link>
                    </Button>
                    <Button variant="secondary" disabled>
                      Create team (coming soon)
                    </Button>
                  </Inline>
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
