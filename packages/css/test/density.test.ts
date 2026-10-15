import { describe, expect, it } from 'vitest';
import { declarations, read } from './helpers';

const density = read('packages/css/src/density.css');
const STEPS = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];

const px = (value: string) => {
  const m = value.match(/^(-?[\d.]+)rem$/);
  if (!m) throw new Error(`expected a rem value, got ${value}`);
  return Number(m[1]) * 16;
};

describe.each([
  ['default', /^:root$/],
  ['compact', /^\[data-mizu-density="compact"\]$/],
  ['comfortable', /^\[data-mizu-density="comfortable"\]$/],
])('%s density font sizes', (_, selector) => {
  const sizes = declarations(density, selector);

  // Fractional pixel sizes (0.656rem = 10.496px) render blurry text and let
  // two adjacent steps round to the same pixel size on 1x screens.
  it('every step is a whole number of pixels', () => {
    for (const step of STEPS) {
      const value = sizes[`--mizu-font-size-${step}`];
      expect(value, step).toBeDefined();
      expect(Number.isInteger(px(value)), `${step} = ${value} = ${px(value)}px`).toBe(true);
    }
  });

  it('steps strictly increase', () => {
    const values = STEPS.map((s) => px(sizes[`--mizu-font-size-${s}`]));
    for (let i = 1; i < values.length; i++) expect(values[i]).toBeGreaterThan(values[i - 1]);
  });
});

describe('density scale relationship', () => {
  it('compact stays within 1px of 0.875x and comfortable within 1px of 1.125x', () => {
    const base = declarations(density, /^:root$/);
    const compact = declarations(density, /^\[data-mizu-density="compact"\]$/);
    const comfortable = declarations(density, /^\[data-mizu-density="comfortable"\]$/);
    for (const step of STEPS) {
      const b = px(base[`--mizu-font-size-${step}`]);
      expect(Math.abs(px(compact[`--mizu-font-size-${step}`]) - b * 0.875)).toBeLessThanOrEqual(
        0.5,
      );
      expect(Math.abs(px(comfortable[`--mizu-font-size-${step}`]) - b * 1.125)).toBeLessThanOrEqual(
        0.5,
      );
    }
  });
});
