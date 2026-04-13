'use client';

import './foundation-panel.css';
import { useState, useEffect } from 'react';
import { useCraftStore } from '@/store/craft-store';
import type {
  ChromaIntensity,
  ColorMood,
  ContrastTier,
  DarkModePhilosophy,
  ExtendedColor,
  HuePersonality,
} from '@/lib/craft/profile';

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

const COLOR_MOOD_OPTIONS: Array<{ id: ColorMood; label: string; hint: string }> = [
  { id: 'tonal', label: 'Tonal', hint: 'subtle accent, professional' },
  { id: 'vibrant', label: 'Vibrant', hint: 'high chroma, energetic' },
  { id: 'muted', label: 'Muted', hint: 'low chroma, calm' },
  { id: 'monochrome', label: 'Monochrome', hint: 'single hue, editorial' },
  { id: 'expressive', label: 'Expressive', hint: 'high contrast, playful' },
];

const CONTRAST_OPTIONS: Array<{ id: ContrastTier; label: string; hint: string }> = [
  { id: 'aa-comfortable', label: 'AA comfortable', hint: 'WCAG AA + breathing room' },
  { id: 'aaa-conservative', label: 'AAA conservative', hint: 'gov / medical / finance' },
  { id: 'editorial-high', label: 'Editorial high', hint: 'maximum legibility' },
];

const CONTRAST_LEVEL_STOPS = [
  { value: -0.5, label: 'Reduced' },
  { value: 0, label: 'Default' },
  { value: 0.5, label: 'High' },
  { value: 1, label: 'Maximum' },
];

const DARK_MODE_OPTIONS: Array<{ id: DarkModePhilosophy; label: string; hint: string }> = [
  { id: 'parallel', label: 'Parallel theme', hint: 'flip tokens, Linear' },
  { id: 'inverted', label: 'Absolute flip', hint: 'high-contrast invert' },
  { id: 'dim', label: 'Dim not dark', hint: 'GitHub dim mode' },
  { id: 'none', label: 'Light only', hint: 'no dark mode shipped' },
];

function hexToHue(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  return h < 0 ? h + 360 : h;
}

function hexToPersonality(hue: number): HuePersonality {
  if ((hue >= 0 && hue <= 60) || hue >= 300) return 'warm';
  if (hue >= 180 && hue <= 260) return 'cool';
  return 'neutral';
}

function hexToChroma(hex: string): ChromaIntensity {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  if (sat < 0.3) return 'muted';
  if (sat < 0.65) return 'balanced';
  return 'vibrant';
}

export function FoundationPanel() {
  const foundation = useCraftStore((s) => s.profile.foundation);
  const updateCluster = useCraftStore((s) => s.updateCluster);
  const setPreviewDark = useCraftStore((s) => s.setPreviewDark);
  const setPreviewPath = useCraftStore((s) => s.setPreviewPath);
  const [seedInput, setSeedInput] = useState(foundation.seedColor ?? '#3b82f6');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#ef4444');

  // Foundation colors affect everything — default to overview on mount
  useEffect(() => {
    setPreviewPath('/');
  }, [setPreviewPath]);

  const applySeedColor = (hex: string) => {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    const hue = hexToHue(hex);
    updateCluster('foundation', {
      seedColor: hex,
      brandHue: hue,
      huePersonality: hexToPersonality(hue),
      chroma: hexToChroma(hex),
    });
  };

  const addExtendedColor = () => {
    if (!newColorName.trim() || !/^#[0-9a-fA-F]{6}$/.test(newColorHex)) return;
    const existing = foundation.extendedColors ?? [];
    if (existing.length >= 8) return;
    updateCluster('foundation', {
      extendedColors: [
        ...existing,
        { name: newColorName.trim(), hex: newColorHex, harmonize: true },
      ],
    });
    setNewColorName('');
  };

  const removeExtendedColor = (index: number) => {
    const existing = foundation.extendedColors ?? [];
    updateCluster('foundation', {
      extendedColors: existing.filter((_, i) => i !== index),
    });
  };

  const toggleHarmonize = (index: number) => {
    const existing = foundation.extendedColors ?? [];
    updateCluster('foundation', {
      extendedColors: existing.map((c, i) => (i === index ? { ...c, harmonize: !c.harmonize } : c)),
    });
  };

  return (
    <div className="craft-foundation">
      <header className="craft-foundation__header">
        <h1 className="craft-foundation__title">Foundation</h1>
        <p className="craft-foundation__lede">
          The raw material — paste a brand hex to auto-populate, or fine-tune each knob. The color
          mood shapes how secondary and tertiary palettes derive from your primary. The contrast
          slider controls accessibility strength. Everything else builds on what you set here.
        </p>
      </header>

      <div className="craft-foundation__grid">
        <div className="craft-foundation__controls">
          {/* Seed color — paste your brand hex */}
          <Section
            title="Seed color"
            hint="Paste your brand hex — auto-fills hue, personality, and chroma."
          >
            <div className="craft-foundation__seed-row">
              <input
                type="color"
                value={seedInput}
                onChange={(e) => {
                  setSeedInput(e.target.value);
                  applySeedColor(e.target.value);
                }}
                className="craft-foundation__color-picker"
                aria-label="Seed color picker"
              />
              <input
                type="text"
                value={seedInput}
                onChange={(e) => {
                  setSeedInput(e.target.value);
                  if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                    applySeedColor(e.target.value);
                  }
                }}
                placeholder="#3b82f6"
                className="craft-foundation__hex-input"
                aria-label="Seed color hex"
                spellCheck={false}
              />
              <div
                className="craft-foundation__seed-preview"
                style={{ background: seedInput }}
                aria-hidden
              >
                <span className="craft-foundation__seed-hue">{foundation.brandHue}°</span>
              </div>
            </div>
          </Section>

          <Section title="Hue personality" hint="The emotional temperature of your brand color.">
            <div
              className="craft-foundation__chip-row"
              role="radiogroup"
              aria-label="Hue personality"
            >
              {HUE_PERSONALITIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={foundation.huePersonality === p.id}
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
                    aria-hidden="true"
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

          {/* Color mood — Material-inspired scheme variants */}
          <Section
            title="Color mood"
            hint="How secondary and tertiary palettes derive from your primary."
          >
            <OptionGroup
              label="Color mood"
              options={COLOR_MOOD_OPTIONS}
              value={foundation.colorMood ?? 'tonal'}
              onChange={(v) => updateCluster('foundation', { colorMood: v })}
            />
          </Section>

          <Section title="Chroma intensity" hint="How saturated the palette feels.">
            <OptionGroup
              label="Chroma intensity"
              options={CHROMA_OPTIONS}
              value={foundation.chroma}
              onChange={(v) => updateCluster('foundation', { chroma: v })}
            />
          </Section>

          <Section title="Contrast tier" hint="How far apart text sits from surface.">
            <OptionGroup
              label="Contrast tier"
              options={CONTRAST_OPTIONS}
              value={foundation.contrast}
              onChange={(v) => updateCluster('foundation', { contrast: v })}
            />
          </Section>

          {/* Contrast level slider */}
          <Section
            title={`Contrast level · ${(foundation.contrastLevel ?? 0) > 0 ? '+' : ''}${foundation.contrastLevel ?? 0}`}
            hint="Fine-tune contrast strength. Negative = reduced, positive = boosted."
          >
            <input
              type="range"
              min={-1}
              max={1}
              step={0.1}
              value={foundation.contrastLevel ?? 0}
              onChange={(e) =>
                updateCluster('foundation', { contrastLevel: Number(e.target.value) })
              }
              className="craft-foundation__contrast-slider"
              aria-label="Contrast level"
            />
            <div className="craft-foundation__slider-labels">
              {CONTRAST_LEVEL_STOPS.map((stop) => (
                <button
                  key={stop.value}
                  type="button"
                  className="craft-foundation__slider-stop"
                  data-active={(foundation.contrastLevel ?? 0) === stop.value || undefined}
                  onClick={() => updateCluster('foundation', { contrastLevel: stop.value })}
                >
                  {stop.label}
                </button>
              ))}
            </div>
          </Section>

          <Section
            title="Dark mode philosophy"
            hint="How dark mode relates to light. Selecting a dark strategy switches the preview to dark."
          >
            <OptionGroup
              label="Dark mode philosophy"
              options={DARK_MODE_OPTIONS}
              value={foundation.darkMode}
              onChange={(v) => {
                updateCluster('foundation', { darkMode: v });
                setPreviewDark(v !== 'none');
              }}
            />
          </Section>

          <Section
            title="Default scheme"
            hint="Whether the product ships as light-first, dark-first, or single-mode only."
          >
            <div
              className="craft-foundation__chip-row"
              role="radiogroup"
              aria-label="Default scheme"
            >
              {(
                [
                  { id: 'light', label: 'Light' },
                  { id: 'dark', label: 'Dark' },
                  { id: 'light-only', label: 'Light only' },
                  { id: 'dark-only', label: 'Dark only' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={foundation.defaultScheme === opt.id}
                  className="craft-foundation__chip"
                  data-active={(foundation.defaultScheme ?? 'light') === opt.id || undefined}
                  onClick={() => {
                    updateCluster('foundation', { defaultScheme: opt.id });
                    if (opt.id === 'dark' || opt.id === 'dark-only') setPreviewDark(true);
                    else setPreviewDark(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Section>

          <Section
            title={`Neutral tint · ${foundation.neutralHue ?? 'auto (brand hue)'}`}
            hint="Independent hue for surfaces, text, and borders. Set to decouple from brand color."
          >
            <div className="craft-foundation__chip-row">
              <button
                type="button"
                className="craft-foundation__chip"
                data-active={foundation.neutralHue === undefined || undefined}
                onClick={() => updateCluster('foundation', { neutralHue: undefined })}
              >
                Auto
              </button>
              <button
                type="button"
                className="craft-foundation__chip"
                data-active={foundation.neutralHue === 0 || undefined}
                onClick={() => updateCluster('foundation', { neutralHue: 0 })}
              >
                <span className="craft-foundation__chip-swatch" style={{ background: '#888' }} />
                Pure grey
              </button>
              <button
                type="button"
                className="craft-foundation__chip"
                data-active={foundation.neutralHue === 75 || undefined}
                onClick={() => updateCluster('foundation', { neutralHue: 75 })}
              >
                <span
                  className="craft-foundation__chip-swatch"
                  style={{ background: 'hsl(75 14% 80%)' }}
                />
                Warm cream
              </button>
              <button
                type="button"
                className="craft-foundation__chip"
                data-active={foundation.neutralHue === 240 || undefined}
                onClick={() => updateCluster('foundation', { neutralHue: 240 })}
              >
                <span
                  className="craft-foundation__chip-swatch"
                  style={{ background: 'hsl(240 10% 80%)' }}
                />
                Cool blue-grey
              </button>
            </div>
            {foundation.neutralHue !== undefined && (
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={foundation.neutralHue}
                onChange={(e) =>
                  updateCluster('foundation', { neutralHue: Number(e.target.value) })
                }
                className="craft-foundation__hue-slider"
                aria-label="Neutral hue"
              />
            )}
          </Section>

          {/* Extended colors — custom brand colors with harmonization */}
          <Section
            title="Extended colors"
            hint="Custom brand colors (success, warning, VIP). Harmonize shifts hue toward your brand."
          >
            <div className="craft-foundation__extended-list">
              {(foundation.extendedColors ?? []).map((color, i) => (
                <div key={i} className="craft-foundation__extended-item">
                  <span
                    className="craft-foundation__extended-swatch"
                    style={{ background: color.hex }}
                  />
                  <span className="craft-foundation__extended-name">{color.name}</span>
                  <span className="craft-foundation__extended-hex">{color.hex}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={color.harmonize}
                    className="craft-foundation__extended-toggle"
                    data-active={color.harmonize || undefined}
                    onClick={() => toggleHarmonize(i)}
                    aria-label={`Harmonize ${color.name} with brand`}
                  >
                    {color.harmonize ? 'H' : '—'}
                  </button>
                  <button
                    type="button"
                    className="craft-foundation__extended-remove"
                    onClick={() => removeExtendedColor(i)}
                    aria-label={'Remove ' + color.name}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {(foundation.extendedColors ?? []).length < 8 && (
              <div className="craft-foundation__extended-add">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="craft-foundation__color-picker craft-foundation__color-picker--sm"
                  aria-label="New extended color"
                />
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Color name (e.g. success)"
                  className="craft-foundation__hex-input"
                  aria-label="Extended color name"
                  onKeyDown={(e) => e.key === 'Enter' && addExtendedColor()}
                />
                <button
                  type="button"
                  className="craft-foundation__chip"
                  onClick={addExtendedColor}
                  disabled={!newColorName.trim()}
                >
                  + Add
                </button>
              </div>
            )}
          </Section>
        </div>

        {/* Preview is in the persistent craft-shell layout */}
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
  label,
}: {
  options: Array<{ id: T; label: string; hint: string }>;
  value: T;
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div className="craft-foundation__options" role="radiogroup" aria-label={label}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="radio"
          aria-checked={value === opt.id}
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
