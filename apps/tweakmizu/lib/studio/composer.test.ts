import { describe, expect, it } from 'vitest';
import { compose, resolvePatternsForPlan } from './composer';
import type { IntentSpec } from '@/types/studio';

function buildIntent(overrides: Partial<IntentSpec> = {}): IntentSpec {
  return {
    productName: 'my-cloud-app',
    description: 'Heroku-style PaaS for Next.js',
    industry: 'cloud',
    stack: 'next-app-router',
    tone: 'technical',
    density: 'default',
    pages: [
      { slug: '/', label: 'Landing' },
      { slug: '/apps', label: 'Apps list' },
      { slug: '/apps/[id]', label: 'App detail' },
      { slug: '/settings', label: 'Settings' },
    ],
    ...overrides,
  };
}

describe('studio composer', () => {
  it('returns a plan with at least one entry for a cloud intent', () => {
    const { plan, fallback } = compose(buildIntent());
    expect(fallback).toBe(false);
    expect(plan.entries.length).toBeGreaterThan(0);
    expect(plan.rationale).toBeTruthy();
    expect(plan.intent.industry).toBe('cloud');
  });

  it('assigns a pattern to every requested page', () => {
    const intent = buildIntent();
    const { plan } = compose(intent);
    expect(plan.entries.length).toBe(intent.pages.length);
    for (const entry of plan.entries) {
      expect(entry.patternId).toMatch(/^cloud\./);
      expect(entry.route.startsWith('/')).toBe(true);
    }
  });

  it('produces unique pattern ids across entries when enough patterns exist', () => {
    const { plan } = compose(buildIntent());
    const ids = plan.entries.map((e) => e.patternId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('falls back to cloud patterns when the industry has none', () => {
    const intent = buildIntent({
      industry: 'editorial',
      pages: [
        { slug: '/', label: 'Home' },
        { slug: '/articles', label: 'Articles' },
      ],
    });
    const { plan, fallback } = compose(intent);
    expect(fallback).toBe(true);
    expect(plan.entries.length).toBe(intent.pages.length);
  });

  it('populates unusedPatternIds with the remaining catalog', () => {
    const intent = buildIntent({
      pages: [{ slug: '/', label: 'Landing' }],
    });
    const { plan } = compose(intent);
    expect(plan.entries.length).toBe(1);
    expect(plan.unusedPatternIds.length).toBeGreaterThan(0);
  });

  it('resolvePatternsForPlan returns the real pattern modules', () => {
    const { plan } = compose(buildIntent());
    const patterns = resolvePatternsForPlan(plan);
    expect(patterns.length).toBe(plan.entries.length);
    for (const p of patterns) {
      expect(typeof p.renderReact).toBe('function');
    }
  });

  it('generates a stable id prefix', () => {
    const { plan } = compose(buildIntent());
    expect(plan.id.startsWith('plan-')).toBe(true);
  });

  it('uses ecommerce patterns when the industry is ecommerce', () => {
    const intent = buildIntent({
      industry: 'ecommerce',
      pages: [
        { slug: '/customers', label: 'Customers' },
        { slug: '/orders', label: 'Orders' },
      ],
    });
    const { plan, fallback } = compose(intent);
    expect(fallback).toBe(false);
    expect(plan.entries.length).toBe(2);
    for (const entry of plan.entries) {
      expect(entry.patternId).toMatch(/^commerce\./);
    }
  });
});
