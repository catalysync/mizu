'use client';

import { Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useIsPro } from './craft-pro-context';
import './pro-upsell.css';

export function ProBanner() {
  const isPro = useIsPro();
  if (isPro) return null;

  return (
    <Link href="/pricing" className="pro-banner">
      <Sparkles size={14} className="pro-banner__icon" />
      <span className="pro-banner__text">
        <strong>Free plan</strong> — 5 AI msg/hr, 6 presets
      </span>
      <span className="pro-banner__cta">Upgrade</span>
    </Link>
  );
}

export function ProGate({ children, feature }: { children: React.ReactNode; feature: string }) {
  const isPro = useIsPro();
  if (isPro) return <>{children}</>;

  return (
    <div className="pro-gate">
      <div className="pro-gate__overlay">
        <Lock size={16} />
        <span>{feature}</span>
        <Link href="/pricing" className="pro-gate__link">
          Unlock with Pro
        </Link>
      </div>
      <div className="pro-gate__blur">{children}</div>
    </div>
  );
}

export function ProBadge() {
  return <span className="pro-badge">Pro</span>;
}
