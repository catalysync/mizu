import { Button, Grid, Inline, Stack } from '@aspect/react';
import { ArrowRight, LayoutGrid, Sliders, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function StudioHome() {
  return (
    <Stack gap="2rem">
      <Stack gap="1rem">
        <span className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          Studio
        </span>
        <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
          Describe the product.
          <br />
          Pick the industry.
          <br />
          Get the design system.
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          A running starter with layout primitives, design tokens, and real patterns mined from mizu
          storybook demos and attributed design systems.
        </p>
      </Stack>

      <Inline gap="0.75rem" align="center">
        <Button asChild variant="primary" size="lg">
          <Link href="/studio/new">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate a project
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/studio/catalog">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Browse catalog
          </Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/studio/editor">
            <Sliders className="mr-2 h-4 w-4" />
            Open editor
          </Link>
        </Button>
      </Inline>

      <Grid gap="1rem" min="16rem">
        <QuickCard
          href="/studio/new"
          title="New project"
          description="Fill out an intent form and get a running starter."
        />
        <QuickCard
          href="/studio/catalog"
          title="Browse catalog"
          description="Patterns mined from Cloudscape, Heroku, Linear, Stripe, and more."
        />
        <QuickCard
          href="/studio/editor"
          title="Editor"
          description="Tweak colors, typography, and radius with a live preview."
        />
        <QuickCard
          href="/dashboard"
          title="Projects"
          description="Every project you've generated, stored locally."
        />
      </Grid>
    </Stack>
  );
}

function QuickCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="border-border bg-background hover:border-border-strong hover:bg-muted/40 rounded-lg border p-5 transition-colors"
    >
      <Stack gap="0.375rem" align="start">
        <span className="text-foreground text-base font-semibold">{title}</span>
        <span className="text-muted-foreground text-sm">{description}</span>
      </Stack>
    </Link>
  );
}
