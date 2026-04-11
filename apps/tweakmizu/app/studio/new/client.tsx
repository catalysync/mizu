'use client';

import { useRouter } from 'next/navigation';
import { IntentForm } from '@/components/studio/intent-form';
import { compose } from '@/lib/studio/composer';
import { usePlansStore } from '@/store/plans-store';
import type { IntentSpec } from '@/types/studio';

export function StudioNewClient() {
  const router = useRouter();
  const savePlan = usePlansStore((state) => state.savePlan);

  const handleSubmit = (spec: IntentSpec) => {
    const { plan } = compose(spec);
    savePlan(plan);
    router.push(`/studio/${plan.id}`);
  };

  return <IntentForm onSubmit={handleSubmit} />;
}
