import { describe, expect, it } from 'vitest';
import { declarations, read } from './helpers';

const density = read('packages/css/src/density.css');
const STEPS = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
const SPACING = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'];

const px = (value: string) => {
  if (value === '0') return 0;
  const m = value.match(/^(-?[\d.]+)rem$/);
  if (!m) throw new Error(`expected a rem value, got ${value}`);
  return Number(m[1]) * 16;
};

const ROOT = /^:root$/;
const COMPACT = /^\[data-mizu-density="compact"\]$/;
const COMFORTABLE = /^\[data-mizu-density="comfortable"\]$/;

describe('default font-size scale', () => {
  const sizes = declarations(density, ROOT);

  // Fractional pixel sizes (10.5px) render blurry text and let adjacent steps
  // collapse to one pixel size on 1x screens.
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

describe('density changes spacing only', () => {
  it.each([
    ['compact', COMPACT],
    ['comfortable', COMFORTABLE],
  ])('%s declares no font-size token', (_, selector) => {
    const overrides = declarations(density, selector);
    expect(Object.keys(overrides).filter((name) => name.startsWith('--mizu-font-size'))).toEqual(
      [],
    );
    expect(Object.keys(overrides).length).toBeGreaterThan(0);
  });

  it('compact stays within 0.5px of 0.875x and comfortable within 0.5px of 1.125x the default spacing', () => {
    const base = declarations(density, ROOT);
    const compact = declarations(density, COMPACT);
    const comfortable = declarations(density, COMFORTABLE);
    for (const step of SPACING) {
      const name = `--mizu-spacing-${step}`;
      const b = px(base[name]);
      expect(Math.abs(px(compact[name]) - b * 0.875), `compact ${name}`).toBeLessThanOrEqual(0.5);
      expect(
        Math.abs(px(comfortable[name]) - b * 1.125),
        `comfortable ${name}`,
      ).toBeLessThanOrEqual(0.5);
    }
  });
});
