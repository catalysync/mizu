import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getAllPatterns } from '@/lib/patterns/registry';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Grid, Stack } from '@aspect/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Gallery — tweakmizu',
  description:
    'Explore patterns and generated projects from the tweakmizu community. Get inspired, clone into your studio.',
};

const INDUSTRY_LABEL: Record<string, string> = {
  cloud: 'Cloud / PaaS',
  'saas-admin': 'SaaS Admin',
  ecommerce: 'E-commerce',
  fintech: 'Fintech',
  'ai-product': 'AI',
  editorial: 'Editorial',
  devtools: 'Dev tools',
  other: 'Other',
};

export default function GalleryPage() {
  const patterns = getAllPatterns();
  const grouped = new Map<string, typeof patterns>();
  for (const p of patterns) {
    for (const industry of p.meta.industries) {
      if (!grouped.has(industry)) grouped.set(industry, []);
      grouped.get(industry)!.push(p);
    }
  }

  const industries = Array.from(grouped.entries())
    .filter(([, group]) => group.length > 0)
    .sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 py-12">
          <Stack gap="2.5rem">
            <Stack gap="0.75rem" align="start">
              <span className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                Gallery
              </span>
              <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-5xl">
                Explore the catalog by industry
              </h1>
              <p className="text-muted-foreground max-w-2xl text-lg">
                Every pattern below is a re-implementation of a real design system page or section
                on top of mizu primitives. Jump into the studio to remix, tweak, or export any of
                them.
              </p>
              <Button asChild variant="primary">
                <Link href="/studio/new">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start from intent
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Stack>

            {industries.map(([industry, group]) => (
              <Stack key={industry} gap="1rem">
                <Stack gap="0.25rem">
                  <h2 className="text-foreground text-xl font-semibold">
                    {INDUSTRY_LABEL[industry] ?? industry}
                  </h2>
                  <span className="text-muted-foreground text-sm">
                    {group.length} pattern{group.length === 1 ? '' : 's'}
                  </span>
                </Stack>
                <Grid gap="1rem" min="20rem">
                  {group.map((pattern) => (
                    <Card key={`${industry}-${pattern.meta.id}`}>
                      <CardHeader
                        title={pattern.meta.name}
                        description={pattern.meta.description}
                      />
                      <CardBody>
                        <Stack gap="0.5rem">
                          <span className="text-muted-foreground text-xs tracking-wider uppercase">
                            Sources
                          </span>
                          <Stack gap="0.25rem">
                            {pattern.meta.sources.slice(0, 3).map((src, i) => (
                              <span
                                key={`${src.system}-${i}`}
                                className="text-muted-foreground text-xs"
                              >
                                <strong className="text-foreground">{src.system}</strong> (
                                {src.relationship})
                              </span>
                            ))}
                          </Stack>
                        </Stack>
                      </CardBody>
                      <CardFooter>
                        <Badge tone={pattern.meta.tier === 'free' ? 'success' : 'info'}>
                          {pattern.meta.tier}
                        </Badge>
                        <Link href={`/studio/catalog?pattern=${pattern.meta.id}`}>
                          <Button variant="ghost" size="sm">
                            Open in catalog
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            ))}
          </Stack>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
