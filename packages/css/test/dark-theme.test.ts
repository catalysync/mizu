import { describe, expect, it } from 'vitest';
import { contrast, darkTokens, resolve } from './helpers';

describe('dark sample theme text', () => {
  const t = darkTokens();
  const primary = resolve(t, '--mizu-text-primary').toLowerCase();

  // Pure #ffffff on near-black (20:1) causes halation: thin text glows and
  // smears for many readers, astigmatic ones especially. Dark themes use an
  // off-white instead.
  it('primary text is an off-white, not pure white', () => {
    expect(primary).not.toBe('#ffffff');
    expect(primary).not.toBe('#fff');
    expect(contrast(primary, '#ffffff')).toBeGreaterThan(1.05);
  });

  it.each(['--mizu-surface-default', '--mizu-surface-secondary'])(
    'primary text keeps AAA contrast (7:1) on %s',
    (surface) => {
      expect(contrast(primary, resolve(t, surface))).toBeGreaterThanOrEqual(7);
    },
  );

  it('primary text stays clearly above secondary text', () => {
    const background = resolve(t, '--mizu-surface-default');
    const secondary = resolve(t, '--mizu-text-secondary');
    expect(contrast(primary, background)).toBeGreaterThan(contrast(secondary, background) * 1.5);
  });
});
