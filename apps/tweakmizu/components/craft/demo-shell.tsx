'use client';

import './demo-shell.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@aspect/react';
import { useCraftStore } from '@/store/craft-store';
import { installPreviewPublisher } from './preview/preview-bridge';
import { CraftProProvider } from './craft-pro-context';
import { HydrationGate } from './hydration-gate';
import { PreviewDock } from './preview-dock';
import { ArchetypePicker } from './archetype-picker';
import { ThemeToggle } from '@/components/theme-toggle';
import type { ChromaIntensity } from '@/lib/craft/profile';

type Tab = 'archetypes' | 'knobs';

const CHROMA_OPTIONS: Array<{ id: ChromaIntensity; label: string }> = [
  { id: 'muted', label: 'Muted' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'vibrant', label: 'Vibrant' },
];

const RADIUS_OPTIONS = [
  { id: 'sharp', label: 'Sharp' },
  { id: 'soft', label: 'Soft' },
  { id: 'pillowy', label: 'Pillowy' },
  { id: 'pill', label: 'Pill' },
] as const;

export function DemoShell() {
  const [tab, setTab] = useState<Tab>('archetypes');
  const [mobilePreview, setMobilePreview] = useState(false);

  // Broadcast profile changes to preview iframe
  useEffect(() => {
    return installPreviewPublisher();
  }, []);

  return (
    <CraftProProvider isPro={false}>
      <div className="demo-shell">
        <header className="demo-shell__header">
          <Link href="/" className="demo-shell__brand">
            <span className="demo-shell__brand-mark">{'\u2737'}</span>
            <span className="demo-shell__brand-text">craft</span>
            <span className="demo-shell__brand-demo">demo</span>
          </Link>
          <div className="demo-shell__header-actions">
            <ThemeToggle size="sm" />
            <Button asChild size="sm" variant="primary">
              <Link href="/signin?callbackUrl=/craft">Sign up for full access</Link>
            </Button>
          </div>
        </header>

        <div className="demo-shell__body">
          <div className="demo-shell__panes">
            <div className="demo-shell__left">
              <HydrationGate>
                <div className="demo-shell__tabs" role="tablist" aria-label="Demo sections">
                  <button
                    type="button"
                    role="tab"
                    className="demo-shell__tab"
                    data-active={tab === 'archetypes' || undefined}
                    aria-selected={tab === 'archetypes'}
                    onClick={() => setTab('archetypes')}
                  >
                    Archetypes
                  </button>
                  <button
                    type="button"
                    role="tab"
                    className="demo-shell__tab"
                    data-active={tab === 'knobs' || undefined}
                    aria-selected={tab === 'knobs'}
                    onClick={() => setTab('knobs')}
                  >
                    Knobs
                  </button>
                </div>

                {tab === 'archetypes' && <ArchetypePicker onAfterPick={() => setTab('knobs')} />}
                {tab === 'knobs' && <DemoKnobs />}

                <div className="demo-shell__banner">
                  <Sparkles size={16} />
                  <span className="demo-shell__banner-text">
                    <strong>Sign up to save & export.</strong> The full studio has 10 knob panels,
                    AI prompt generation, team sharing, and CSS/JSON export.
                  </span>
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/signin?callbackUrl=/craft">Sign up</Link>
                  </Button>
                </div>
              </HydrationGate>
            </div>

            {/* Desktop preview */}
            <aside className="demo-shell__right" aria-label="Live preview">
              <PreviewDock />
            </aside>
          </div>

          {/* Mobile preview FAB */}
          <button
            type="button"
            className="demo-shell__preview-fab"
            onClick={() => setMobilePreview(true)}
            aria-label="Open preview"
          >
            <Eye size={18} />
          </button>

          {/* Mobile preview slide-in */}
          {mobilePreview && (
            <>
              <button
                type="button"
                className="demo-shell__preview-backdrop"
                aria-hidden
                tabIndex={-1}
                onClick={() => setMobilePreview(false)}
              />
              <div className="demo-shell__preview-mobile" data-open>
                <div className="demo-shell__preview-mobile-header">
                  <button
                    type="button"
                    className="demo-shell__preview-mobile-close"
                    onClick={() => setMobilePreview(false)}
                    aria-label="Close preview"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="demo-shell__preview-mobile-title">Preview</span>
                </div>
                <div className="demo-shell__preview-mobile-body">
                  <PreviewDock />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CraftProProvider>
  );
}

function DemoKnobs() {
  const foundation = useCraftStore((s) => s.profile.foundation);
  const shape = useCraftStore((s) => s.profile.shape);
  const updateCluster = useCraftStore((s) => s.updateCluster);

  return (
    <div className="demo-shell__knobs">
      {/* Brand hue slider */}
      <section className="demo-shell__knob-section">
        <h2 className="demo-shell__knob-title">Brand hue &middot; {foundation.brandHue}&deg;</h2>
        <p className="demo-shell__knob-hint">
          Drag to shift the primary color across the spectrum.
        </p>
        <div className="demo-shell__hue-preview">
          <span
            className="demo-shell__hue-swatch"
            style={{ background: `hsl(${foundation.brandHue} 60% 48%)` }}
            aria-hidden="true"
          />
          <span className="demo-shell__hue-value">{foundation.brandHue}&deg;</span>
        </div>
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={foundation.brandHue}
          onChange={(e) => updateCluster('foundation', { brandHue: Number(e.target.value) })}
          className="demo-shell__hue-slider"
          aria-label="Brand hue"
        />
      </section>

      {/* Chroma intensity */}
      <section className="demo-shell__knob-section">
        <h2 className="demo-shell__knob-title">Chroma intensity</h2>
        <p className="demo-shell__knob-hint">How saturated the palette feels.</p>
        <div className="demo-shell__chip-row" role="radiogroup" aria-label="Chroma intensity">
          {CHROMA_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={foundation.chroma === opt.id}
              className="demo-shell__chip"
              data-active={foundation.chroma === opt.id || undefined}
              onClick={() => updateCluster('foundation', { chroma: opt.id })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Corner radius */}
      <section className="demo-shell__knob-section">
        <h2 className="demo-shell__knob-title">Corner radius</h2>
        <p className="demo-shell__knob-hint">How rounded elements feel.</p>
        <div className="demo-shell__chip-row" role="radiogroup" aria-label="Corner radius">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={shape.radius === opt.id}
              className="demo-shell__chip"
              data-active={shape.radius === opt.id || undefined}
              onClick={() => updateCluster('shape', { radius: opt.id })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
