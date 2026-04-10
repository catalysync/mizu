import { describe, expect, it } from 'vitest';
import { formatDelta, deltaIntent } from './delta';

describe('formatDelta', () => {
  it('formats positive delta with plus sign', () => {
    expect(formatDelta(0.024)).toBe('+2.4%');
  });

  it('formats negative delta', () => {
    expect(formatDelta(-0.018)).toBe('-1.8%');
  });

  it('formats zero', () => {
    expect(formatDelta(0)).toBe('0.0%');
  });
});

describe('deltaIntent', () => {
  it('returns positive for > 0', () => {
    expect(deltaIntent(0.05)).toBe('positive');
  });

  it('returns negative for < 0', () => {
    expect(deltaIntent(-0.02)).toBe('negative');
  });

  it('returns neutral for 0', () => {
    expect(deltaIntent(0)).toBe('neutral');
  });
});
