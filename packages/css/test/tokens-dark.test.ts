import { describe, expect, it } from 'vitest';
import { declarations, read } from './helpers';

const generated = read('packages/tokens/dist/css/dark.css');
const dark = declarations(generated, /^\[data-theme="dark"\]$/);

// The dark values every consumer already gets from the hand-written sheet. Changing one is a
// visible theme change, so it is pinned here rather than inferred from the source.
const EXPECTED: Record<string, string> = {
  '--mizu-surface-default': 'var(--mizu-color-slate-950)',
  '--mizu-surface-secondary': 'var(--mizu-color-slate-900)',
  '--mizu-surface-inverse': 'var(--mizu-color-white)',
  '--mizu-surface-hover': 'var(--mizu-color-slate-800)',
  '--mizu-text-primary': 'var(--mizu-color-slate-100)',
  '--mizu-text-secondary': 'var(--mizu-color-slate-400)',
  '--mizu-text-inverse': 'var(--mizu-color-slate-900)',
  '--mizu-text-disabled': 'var(--mizu-color-slate-600)',
  '--mizu-text-tertiary': 'var(--mizu-color-slate-400)',
  '--mizu-border-default': 'var(--mizu-color-slate-800)',
  '--mizu-border-subtle': 'var(--mizu-color-slate-900)',
  '--mizu-border-strong': 'var(--mizu-color-slate-600)',
  '--mizu-shadow-sm': '0 0 0 1px rgb(255 255 255 / 6%), 0 1px 2px 0 rgb(0 0 0 / 60%)',
  '--mizu-shadow-md':
    '0 0 0 1px rgb(255 255 255 / 6%), 0 4px 6px -1px rgb(0 0 0 / 60%), 0 2px 4px -2px rgb(0 0 0 / 60%)',
  '--mizu-shadow-lg':
    '0 0 0 1px rgb(255 255 255 / 6%), 0 10px 15px -3px rgb(0 0 0 / 60%), 0 4px 6px -4px rgb(0 0 0 / 60%)',
  '--mizu-shadow-xl':
    '0 0 0 1px rgb(255 255 255 / 6%), 0 20px 25px -5px rgb(0 0 0 / 60%), 0 8px 10px -6px rgb(0 0 0 / 60%)',
  '--mizu-feedback-success-default': 'var(--mizu-color-emerald-300)',
  '--mizu-feedback-success-subtle': 'var(--mizu-color-emerald-900)',
  '--mizu-feedback-warning-default': 'var(--mizu-color-amber-300)',
  '--mizu-feedback-warning-subtle': 'var(--mizu-color-amber-900)',
  '--mizu-feedback-danger-default': 'var(--mizu-color-red-300)',
  '--mizu-feedback-danger-subtle': 'var(--mizu-color-red-900)',
  '--mizu-feedback-info-default': 'var(--mizu-color-blue-300)',
  '--mizu-feedback-info-subtle': 'var(--mizu-color-blue-900)',
  ...Object.fromEntries(
    Array.from({ length: 8 }, (_, i) => [
      `--mizu-chart-categorical-${i + 1}`,
      `var(--mizu-color-chart-dark-${i + 1})`,
    ]),
  ),
};

describe('generated dark theme (tokens build)', () => {
  it('scopes every override to [data-theme="dark"]', () => {
    expect(generated).toMatch(/\[data-theme="dark"\]\s*\{/);
  });

  it('keeps every existing dark value', () => {
    for (const [name, value] of Object.entries(EXPECTED)) {
      expect(dark[name], name).toBe(value);
    }
  });

  it('overrides only the theme tokens, not the base or semantic scales', () => {
    expect(Object.keys(dark).sort()).toEqual(Object.keys(EXPECTED).sort());
  });
});
