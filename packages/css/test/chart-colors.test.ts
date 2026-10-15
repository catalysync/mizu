import { describe, expect, it } from 'vitest';
import { darkTokens, deltaE, resolve, rootTokens } from './helpers';

const SLOTS = [1, 2, 3, 4, 5, 6, 7, 8];
const STATUS = ['success', 'warning', 'danger'];

describe.each([
  ['light', rootTokens],
  ['dark', darkTokens],
])('%s chart categorical palette', (_, tokens) => {
  const t = tokens();
  const series = SLOTS.map((n) => resolve(t, `--mizu-chart-categorical-${n}`).toLowerCase());
  const status = STATUS.map((s) => resolve(t, `--mizu-feedback-${s}-default`).toLowerCase());

  // A series drawn in the warning amber reads as a warning. The palette used
  // to alias the status steps directly (slot 3 was feedback-warning-default).
  it('no series colour is a status colour or within ΔE 10 of one', () => {
    for (const [i, colour] of series.entries()) {
      for (const [j, s] of status.entries()) {
        expect(deltaE(colour, s), `slot ${i + 1} vs ${STATUS[j]}`).toBeGreaterThanOrEqual(10);
      }
    }
  });

  it('adjacent series stay distinguishable (OKLab ΔE ≥ 15)', () => {
    for (let i = 1; i < series.length; i++) {
      expect(deltaE(series[i - 1], series[i]), `slots ${i} and ${i + 1}`).toBeGreaterThanOrEqual(
        15,
      );
    }
  });

  it('all eight series are distinct', () => {
    expect(new Set(series).size).toBe(8);
  });
});

describe('chart tokens are structurally separate from status tokens', () => {
  // Re-theming a status colour must never repaint a chart series, and the
  // reverse, so the categorical slots draw from their own ramp.
  it('every categorical slot references the dedicated chart ramp', () => {
    const t = rootTokens();
    for (const n of SLOTS) {
      expect(t[`--mizu-chart-categorical-${n}`]).toMatch(/^var\(--mizu-color-chart-\d\)$/);
    }
  });
});
