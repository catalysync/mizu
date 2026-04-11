'use client';

import './foundation-panel.css';
import { Badge } from '@aspect/react';
import { useCraftStore } from '@/store/craft-store';
import type {
  ChromaIntensity,
  ContrastTier,
  DarkModePhilosophy,
  HuePersonality,
} from '@/lib/craft/profile';
import { PreviewDock } from './preview-dock';

const HUE_PERSONALITIES: Array<{
  id: HuePersonality;
  label: string;
  hueHint: number;
}> = [
  { id: 'warm', label: 'Warm', hueHint: 20 },
  { id: 'cool', label: 'Cool', hueHint: 220 },
  { id: 'neutral', label: 'Neutral', hueHint: 0 },
  { id: 'chromatic', label: 'Chromatic', hueHint: 280 },
];

const CHROMA_OPTIONS: Array<{ id: ChromaIntensity; label: string; hint: string }> = [
  { id: 'muted', label: 'Muted', hint: 'Stripe, Linear, Notion' },
  { id: 'balanced', label: 'Balanced', hint: 'mizu default, Geist' },
  { id: 'vibrant', label: 'Vibrant', hint: 'Supabase, Vercel' },
];

const CONTRAST_OPTIONS: Array<{ id: ContrastTier; label: string; hint: string }> = [
  { id: 'aa-comfortable', label: 'AA comfortable', hint: 'WCAG AA + breathing room' },
  { id: 'aaa-conservative', label: 'AAA conservative', hint: 'gov / medical / finance' },
  { id: 'editorial-high', label: 'Editorial high', hint: 'maximum legibility' },
];

const DARK_MODE_OPTIONS: Array<{ id: DarkModePhilosophy; label: string; hint: string }> = [
  { id: 'parallel', label: 'Parallel theme', hint: 'flip tokens, Linear' },
  { id: 'inverted', label: 'Absolute flip', hint: 'high-contrast invert' },
  { id: 'dim', label: 'Dim not dark', hint: 'GitHub dim mode' },
  { id: 'none', label: 'Light only', hint: 'no dark mode shipped' },
];

export function FoundationPanel() {
  const foundation = useCraftStore((s) => s.profile.foundation);
  const updateCluster = useCraftStore((s) => s.updateCluster);

  return (
    <div className="craft-foundation">
      <header className="craft-foundation__header">
        <Badge tone="neutral">Cluster A</Badge>
        <h1 className="craft-foundation__title">Foundation</h1>
        <p className="craft-foundation__lede">
          The raw material — the hue personality, how saturated your palette feels, how much
          contrast you push for, and how you handle dark mode. Everything else builds on what you
          set here.
        </p>
      </header>

      <div className="craft-foundation__grid">
        <div className="craft-foundation__controls">
          <Section title="Hue personality" hint="The emotional temperature of your brand color.">
            <div className="craft-foundation__chip-row">
              {HUE_PERSONALITIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="craft-foundation__chip"
                  data-active={foundation.huePersonality === p.id || undefined}
                  onClick={() =>
                    updateCluster('foundation', {
                      huePersonality: p.id,
                      brandHue: p.hueHint,
                    })
                  }
                >
                  <span
                    className="craft-foundation__chip-swatch"
                    style={{
                      background: `hsl(${p.hueHint} 60% 48%)`,
                    }}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          </Section>

          <Section
            title={`Brand hue · ${foundation.brandHue}°`}
            hint="Pin the exact angle on the color wheel."
          >
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={foundation.brandHue}
              onChange={(e) => updateCluster('foundation', { brandHue: Number(e.target.value) })}
              className="craft-foundation__hue-slider"
              aria-label="Brand hue"
            />
          </Section>

          <Section title="Chroma intensity" hint="How saturated the palette feels.">
            <OptionGroup
              options={CHROMA_OPTIONS}
              value={foundation.chroma}
              onChange={(v) => updateCluster('foundation', { chroma: v })}
            />
          </Section>

          <Section title="Contrast tier" hint="How far apart text sits from surface.">
            <OptionGroup
              options={CONTRAST_OPTIONS}
              value={foundation.contrast}
              onChange={(v) => updateCluster('foundation', { contrast: v })}
            />
          </Section>

          <Section title="Dark mode philosophy" hint="How dark mode relates to light.">
            <OptionGroup
              options={DARK_MODE_OPTIONS}
              value={foundation.darkMode}
              onChange={(v) => updateCluster('foundation', { darkMode: v })}
            />
          </Section>
        </div>

        <aside className="craft-foundation__preview" aria-label="Live preview">
          <PreviewDock />
        </aside>
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="craft-foundation__section">
      <div className="craft-foundation__section-head">
        <h2 className="craft-foundation__section-title">{title}</h2>
        {hint ? <p className="craft-foundation__section-hint">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

function OptionGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ id: T; label: string; hint: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="craft-foundation__options">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className="craft-foundation__option"
          data-active={value === opt.id || undefined}
          onClick={() => onChange(opt.id)}
        >
          <span className="craft-foundation__option-label">{opt.label}</span>
          <span className="craft-foundation__option-hint">{opt.hint}</span>
        </button>
      ))}
    </div>
  );
}
