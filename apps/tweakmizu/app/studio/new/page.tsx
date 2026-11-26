import { Stack } from '@mizunagara/react';
import { StudioNewClient } from './client';

export default function StudioNew() {
  return (
    <Stack gap="6">
      <Stack gap="2">
        <span className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          New project
        </span>
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          What are you building?
        </h1>
        <p className="text-muted-foreground text-lg">
          Describe the product, pick an industry and tone, and we&apos;ll compose a starter from the
          pattern catalog.
        </p>
      </Stack>

      <StudioNewClient />
    </Stack>
  );
}
