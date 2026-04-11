'use client';

import { useState } from 'react';
import { IntentForm } from '@/components/studio/intent-form';
import type { IntentSpec } from '@/types/studio';

export function StudioNewClient() {
  const [lastSpec, setLastSpec] = useState<IntentSpec | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <IntentForm onSubmit={setLastSpec} />

      {lastSpec ? (
        <section
          aria-label="Captured intent"
          className="flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-5"
        >
          <header className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-foreground">Captured intent</h2>
            <span className="text-xs text-muted-foreground">
              Ready to send to the composer (not wired up yet)
            </span>
          </header>
          <pre className="overflow-auto rounded bg-background p-3 text-xs text-foreground">
            {JSON.stringify(lastSpec, null, 2)}
          </pre>
        </section>
      ) : null}
    </div>
  );
}
