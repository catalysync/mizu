import { describe, expect, it } from 'vitest';
import { contrast, darkTokens, declarations, read, resolve, rootTokens } from './helpers';

const TONES = ['success', 'warning', 'danger', 'info'];
const dark = declarations(read('packages/tokens/dist/css/dark.css'), /^\[data-theme="dark"\]$/);

describe('feedback colours in the dark theme', () => {
  it.each(TONES.flatMap((t) => [`--mizu-feedback-${t}-default`, `--mizu-feedback-${t}-subtle`]))(
    'the build emits a dark value for %s',
    (name) => {
      expect(dark[name]).toMatch(/^var\(--mizu-color-(emerald|amber|red|blue)-(300|900)\)$/);
    },
  );

  it.each(TONES)('%s text on its subtle tint keeps AA (4.5:1)', (tone) => {
    const t = darkTokens();
    const text = resolve(t, `--mizu-feedback-${tone}-default`);
    const tint = resolve(t, `--mizu-feedback-${tone}-subtle`);
    expect(contrast(text, tint)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(TONES)('%s default is a visible non-text colour on the dark surface (3:1)', (tone) => {
    const t = darkTokens();
    expect(
      contrast(resolve(t, `--mizu-feedback-${tone}-default`), resolve(t, '--mizu-surface-default')),
    ).toBeGreaterThanOrEqual(3);
  });

  it('the light values are unchanged', () => {
    const light = rootTokens();
    expect(resolve(light, '--mizu-feedback-success-default')).toBe('#059669');
    expect(resolve(light, '--mizu-feedback-danger-subtle')).toBe('#fef2f2');
  });
});
