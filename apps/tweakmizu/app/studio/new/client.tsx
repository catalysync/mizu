'use client';

import { IntentForm } from '@/components/studio/intent-form';
import { compose, type Plan } from '@/lib/studio/composer';
import { usePlansStore } from '@/store/plans-store';
import type { IntentSpec } from '@/types/studio';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface GenerateResponse {
  plan: Plan;
  source: 'claude' | 'fallback';
  error?: string;
}

export function StudioNewClient() {
  const router = useRouter();
  const savePlan = usePlansStore((state) => state.savePlan);
  const [busy, setBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (spec: IntentSpec) => {
    setBusy(true);
    setStatusMessage('Composing your project…');

    try {
      const response = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spec),
      });

      if (response.ok) {
        const data = (await response.json()) as GenerateResponse;
        savePlan(data.plan);
        router.push(`/studio/${data.plan.id}`);
        return;
      }
    } catch {
      // fall through to deterministic
    }

    setStatusMessage('Falling back to deterministic composer…');
    const { plan } = compose(spec);
    savePlan(plan);
    router.push(`/studio/${plan.id}`);
  };

  return (
    <div>
      <IntentForm onSubmit={handleSubmit} />
      {busy && statusMessage ? (
        <p className="text-muted-foreground mt-3 text-sm" role="status">
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}
