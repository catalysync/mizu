'use client';

import './hydration-gate.css';
import { useCraftStore } from '@/store/craft-store';

export function HydrationGate({ children }: { children: React.ReactNode }) {
  const hasHydrated = useCraftStore((s) => s.hasHydrated);

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
