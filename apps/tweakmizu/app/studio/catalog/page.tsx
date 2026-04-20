import { Stack } from '@aspect/react';
import { CatalogBrowser } from './catalog-browser';

export const metadata = {
  title: 'Pattern catalog — tweakmizu studio',
  description:
    'Browse the free-tier pattern catalog: real patterns mined from mizu storybook demos and attributed to source design systems.',
};

export default function StudioCatalog() {
  return (
    <Stack gap="2rem">
      <Stack gap="0.5rem">
        <span className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          Catalog
        </span>
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          Patterns available in the studio
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Each pattern is a re-implementation on top of <code>@aspect/react</code>, grounded in an
          attributed source. The free tier ships these; Pro unlocks the full catalog.
        </p>
      </Stack>

      <CatalogBrowser />
    </Stack>
  );
}
