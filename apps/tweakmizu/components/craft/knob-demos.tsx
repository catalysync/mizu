'use client';

import { profileToCss } from '@/lib/craft/profile-to-css';
import { useCraftStore } from '@/store/craft-store';
import { useMemo } from 'react';

/**
 * Inline visual demos for knob panel sections. Each demo reads from the
 * craft store and applies live CSS variables so the preview updates
 * instantly when any knob changes.
 */

function useCssVars(): React.CSSProperties {
  const profile = useCraftStore((s) => s.profile);
  return useMemo(() => profileToCss(profile) as React.CSSProperties, [profile]);
}

// -- Shape: Corner radius --------------------------------------------------

export function RadiusDemo() {
  const vars = useCssVars();
  const sizes = [
    { size: '1rem', radius: 'var(--mizu-radius-sm)' },
    { size: '1.5rem', radius: 'var(--mizu-radius-md)' },
    { size: '2rem', radius: 'var(--mizu-radius-lg)' },
    { size: '3rem', radius: 'var(--mizu-radius-xl)' },
  ];
  return (
    <div className="craft-knob-panel__demo-radius" style={vars}>
      {sizes.map((s, i) => (
        <div
          key={i}
          className="craft-knob-panel__demo-radius__box"
          style={{
            width: s.size,
            height: s.size,
            borderRadius: s.radius,
          }}
        />
      ))}
    </div>
  );
}

// -- Shape: Border weight --------------------------------------------------

export function BorderWeightDemo() {
  const vars = useCssVars();
  return (
    <div className="craft-knob-panel__demo-border" style={vars}>
      <div
        className="craft-knob-panel__demo-border__card"
        style={{
          width: '4rem',
          height: '2.5rem',
          border: 'var(--mizu-border-width-default) solid var(--mizu-border-strong)',
          borderRadius: 'var(--mizu-radius-md)',
        }}
      >
        <div
          className="craft-knob-panel__demo-border__bar"
          style={{ width: '2rem', height: '0.25rem' }}
        />
      </div>
      <div
        className="craft-knob-panel__demo-border__card"
        style={{
          width: '2.5rem',
          height: '2.5rem',
          border: 'var(--mizu-border-width-default) solid var(--mizu-border-strong)',
          borderRadius: 'var(--mizu-radius-sm)',
        }}
      >
        <div
          className="craft-knob-panel__demo-border__bar"
          style={{ width: '1.25rem', height: '0.25rem' }}
        />
      </div>
    </div>
  );
}

// -- Motion: Easing family -------------------------------------------------

export function EasingDemo() {
  const vars = useCssVars();
  return (
    <div className="craft-knob-panel__demo-easing" style={vars}>
      <div className="craft-knob-panel__demo-easing__track" />
      <div
        className="craft-knob-panel__demo-easing__dot"
        style={{
          animationTimingFunction: 'var(--mizu-easing-out)',
          animationDuration: 'var(--mizu-duration-slow)',
        }}
      />
    </div>
  );
}

// -- Motion: Duration scale ------------------------------------------------

export function DurationDemo() {
  const vars = useCssVars();
  const tiers = [
    { label: 'fast', duration: 'var(--mizu-duration-fast)', opacity: 0.5 },
    { label: 'normal', duration: 'var(--mizu-duration-normal)', opacity: 0.7 },
    { label: 'slow', duration: 'var(--mizu-duration-slow)', opacity: 1 },
  ];
  return (
    <div className="craft-knob-panel__demo-duration" style={vars}>
      {tiers.map((t) => (
        <div
          key={t.label}
          className="craft-knob-panel__demo-duration__bar"
          style={{
            animationDuration: t.duration,
            animationTimingFunction: 'var(--mizu-easing-out)',
            opacity: t.opacity,
          }}
        />
      ))}
    </div>
  );
}

// -- Depth: Shadow flavor --------------------------------------------------

export function ShadowDemo() {
  const vars = useCssVars();
  return (
    <div className="craft-knob-panel__demo-shadow" style={vars}>
      <div
        className="craft-knob-panel__demo-shadow__card"
        style={{ boxShadow: 'var(--mizu-shadow-sm)' }}
      />
      <div
        className="craft-knob-panel__demo-shadow__card"
        style={{ boxShadow: 'var(--mizu-shadow-md)' }}
      />
      <div
        className="craft-knob-panel__demo-shadow__card"
        style={{ boxShadow: 'var(--mizu-shadow-lg)' }}
      />
      <span className="craft-knob-panel__demo-shadow__label">sm / md / lg</span>
    </div>
  );
}

// -- Focus: Focus style ----------------------------------------------------

export function FocusStyleDemo() {
  const vars = useCssVars();
  const style = useCraftStore((s) => s.profile.focus.style);
  const width = useCraftStore((s) => s.profile.focus.width);

  const outlineWidth = style === 'outline' ? width : undefined;

  return (
    <div className="craft-knob-panel__demo-focus" style={vars}>
      <div
        className="craft-knob-panel__demo-focus__input"
        data-style={style}
        style={{
          outlineWidth: outlineWidth,
          outlineOffset: style === 'outline' ? '1px' : undefined,
        }}
      />
      <span className="craft-knob-panel__demo-shadow__label">focused</span>
    </div>
  );
}

// -- Type: Scale ratio -----------------------------------------------------

export function ScaleRatioDemo() {
  const vars = useCssVars();
  const levels = [
    { label: 'h1', size: 'var(--mizu-font-size-xl)' },
    { label: 'h2', size: 'var(--mizu-font-size-lg)' },
    { label: 'h3', size: 'var(--mizu-font-size-md)' },
    { label: 'h4', size: 'var(--mizu-font-size-base)' },
  ];
  return (
    <div className="craft-knob-panel__demo-scale" style={vars}>
      {levels.map((l) => (
        <span
          key={l.label}
          className="craft-knob-panel__demo-scale__level"
          style={{ fontSize: l.size }}
        >
          Aa
          <span className="craft-knob-panel__demo-scale__label"> {l.label}</span>
        </span>
      ))}
    </div>
  );
}

// -- Density: Density mode -------------------------------------------------

export function DensityDemo() {
  const vars = useCssVars();
  return (
    <div className="craft-knob-panel__demo-density" style={vars}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="craft-knob-panel__demo-density__card"
          style={{
            padding: 'var(--mizu-spacing-2)',
            gap: 'var(--mizu-spacing-1)',
            width: '3rem',
          }}
        >
          <div
            className="craft-knob-panel__demo-density__bar craft-knob-panel__demo-density__bar--wide"
            style={{ height: '0.25rem' }}
          />
          <div
            className="craft-knob-panel__demo-density__bar craft-knob-panel__demo-density__bar--short"
            style={{ height: '0.25rem' }}
          />
        </div>
      ))}
    </div>
  );
}
