import Link from 'next/link';
import { Stack } from '@aspect/react';
import { StudioEditorShell } from '@/components/studio/editor/editor-shell';

export const metadata = {
  title: 'Studio editor — tweakmizu',
};

export default function StudioEditorPage() {
  return (
    <Stack gap="1.5rem">
      <Stack gap="0.5rem">
        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Editor
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Studio editor</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
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
