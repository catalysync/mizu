'use client';

import './hydration-gate.css';
import { useEffect, useState } from 'react';
import { useCraftStore } from '@/store/craft-store';

export function HydrationGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Zustand persist rehydrates synchronously in useEffect.
    // By the time this effect runs, the store is already hydrated.
    setReady(true);
  }, []);

  const hasHydrated = useCraftStore((s) => s.hasHydrated) || ready;

  if (!hasHydrated) {
    return (
      <div className="hydration-skeleton">
        <div className="hydration-skeleton__bar hydration-skeleton__bar--title" />
        <div className="hydration-skeleton__bar hydration-skeleton__bar--subtitle" />
        <div className="hydration-skeleton__grid">
          <div className="hydration-skeleton__card" />
          <div className="hydration-skeleton__card" />
          <div className="hydration-skeleton__card" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
