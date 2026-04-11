import { describe, expect, it } from 'vitest';
import {
  filterPatterns,
  getAllPatterns,
  getFreePatterns,
  getPattern,
  getPatternsByIndustry,
} from './registry';

describe('pattern registry', () => {
  it('returns at least one pattern', () => {
    expect(getAllPatterns().length).toBeGreaterThan(0);
  });

  it('every pattern has required metadata', () => {
    for (const p of getAllPatterns()) {
      expect(p.meta.id).toBeTruthy();
      expect(p.meta.name).toBeTruthy();
      expect(p.meta.description).toBeTruthy();
      expect(p.meta.kind).toBeTruthy();
      expect(p.meta.industries.length).toBeGreaterThan(0);
      expect(['free', 'pro']).toContain(p.meta.tier);
      expect(p.meta.sources.length).toBeGreaterThan(0);
      expect(typeof p.renderReact).toBe('function');
    }
  });

  it('every pattern id is unique', () => {
    const ids = getAllPatterns().map((p) => p.meta.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('getPattern finds cloud.apps by id', () => {
    const p = getPattern('cloud.apps');
    expect(p).toBeDefined();
    expect(p?.meta.industries).toContain('cloud');
  });

  it('getPattern returns undefined for an unknown id', () => {
    expect(getPattern('nope.nothing')).toBeUndefined();
  });

  it('filterPatterns filters by industry', () => {
    const results = filterPatterns({ industry: 'cloud' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => p.meta.industries.includes('cloud'))).toBe(true);
  });

  it('filterPatterns filters by tier', () => {
    const results = filterPatterns({ tier: 'free' });
    expect(results.every((p) => p.meta.tier === 'free')).toBe(true);
  });

  it('filterPatterns combines industry + tier', () => {
    const results = filterPatterns({ industry: 'cloud', tier: 'free' });
    expect(results.every((p) => p.meta.industries.includes('cloud'))).toBe(true);
    expect(results.every((p) => p.meta.tier === 'free')).toBe(true);
  });

  it('getPatternsByIndustry is consistent with filterPatterns', () => {
    expect(getPatternsByIndustry('cloud')).toEqual(filterPatterns({ industry: 'cloud' }));
  });

  it('getFreePatterns only returns free tier entries', () => {
    expect(getFreePatterns().every((p) => p.meta.tier === 'free')).toBe(true);
  });

  it('renderReact returns valid output files', () => {
    const p = getPattern('cloud.apps');
    const files = p!.renderReact({ productName: 'my-app', description: 'test' });
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      expect(f.path).toBeTruthy();
      expect(typeof f.contents).toBe('string');
      expect(f.contents.length).toBeGreaterThan(0);
    }
  });
});
