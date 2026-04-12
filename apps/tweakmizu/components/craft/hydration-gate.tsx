'use client';

import './hydration-gate.css';
import { useEffect, useState } from 'react';

export function HydrationGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Zustand persist rehydrates from localStorage synchronously
    // during the first client render. By the time useEffect runs,
    // the store is already hydrated. This single tick delay
    // prevents the flash of default values.
    setReady(true);
  }, []);

  const hasHydrated = ready;

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
