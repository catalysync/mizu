import { StudioEditorShell } from '@/components/studio/editor/editor-shell';
import { Stack } from '@aspect/react';
import Link from 'next/link';

export const metadata = {
  title: 'Studio editor — tweakmizu',
};

export default function StudioEditorPage() {
  return (
    <Stack gap="1.5rem">
      <Stack gap="0.5rem">
        <span className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          Editor
        </span>
        <h1 className="text-foreground text-3xl font-bold tracking-tight">Studio editor</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Colors, typography, radius. The legacy editor at{' '}
          <Link href="/editor" className="underline">
            /editor
          </Link>{' '}
          stays exactly where it is.
        </p>
      </Stack>

      <StudioEditorShell />
    </Stack>
  );
}
