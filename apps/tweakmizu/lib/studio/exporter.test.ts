import type { IntentSpec } from '@/types/studio';
import { describe, expect, it } from 'vitest';
import { compose } from './composer';
import { buildProjectFiles } from './exporter';

function buildIntent(overrides: Partial<IntentSpec> = {}): IntentSpec {
  return {
    productName: 'my-cloud-app',
    description: 'Heroku-style PaaS for Next.js',
    industry: 'cloud',
    stack: 'next-app-router',
    tone: 'technical',
    density: 'default',
    pages: [
      { slug: '/apps', label: 'Apps list' },
      { slug: '/settings', label: 'Settings' },
    ],
    ...overrides,
  };
}

describe('studio exporter', () => {
  it('produces a non-empty file tree', () => {
    const { plan } = compose(buildIntent());
    const files = buildProjectFiles(plan);
    expect(files.length).toBeGreaterThan(5);
    for (const file of files) {
      expect(file.path).toBeTruthy();
      expect(file.path.startsWith('/')).toBe(false);
      expect(typeof file.contents).toBe('string');
      expect(file.contents.length).toBeGreaterThan(0);
    }
  });

  it('includes package.json, README, tsconfig, layout, globals.css, and ai substrate files', () => {
    const { plan } = compose(buildIntent());
    const paths = buildProjectFiles(plan).map((f) => f.path);
    expect(paths).toContain('package.json');
    expect(paths).toContain('README.md');
    expect(paths).toContain('tsconfig.json');
    expect(paths).toContain('app/layout.tsx');
    expect(paths).toContain('app/globals.css');
    expect(paths).toContain('.gitignore');
    expect(paths).toContain('LICENSE');
    expect(paths).toContain('.tweakmizu/substrate.json');
    expect(paths).toContain('.cursor/rules/tweakmizu.mdc');
    expect(paths).toContain('.claude/skills/tweakmizu-design-system/SKILL.md');
  });

  it('emits a page file for every pattern in the plan', () => {
    const { plan } = compose(buildIntent());
    const paths = buildProjectFiles(plan).map((f) => f.path);
    // Each pattern renderReact returns `app/{slug}/page.tsx`
    expect(paths.some((p) => p === 'app/apps/page.tsx')).toBe(true);
    expect(paths.some((p) => p === 'app/settings/page.tsx')).toBe(true);
  });

  it('auto-adds a root home page when no pattern covers /', () => {
    const { plan } = compose(buildIntent());
    const paths = buildProjectFiles(plan).map((f) => f.path);
    expect(paths).toContain('app/page.tsx');
  });

  it('substrate.json has the right shape', () => {
    const { plan } = compose(buildIntent());
    const files = buildProjectFiles(plan);
    const substrate = files.find((f) => f.path === '.tweakmizu/substrate.json');
    expect(substrate).toBeDefined();
    const parsed = JSON.parse(substrate!.contents);
    expect(parsed.substrateVersion).toBe(1);
    expect(parsed.project.name).toBe('my-cloud-app');
    expect(parsed.patterns.length).toBe(plan.entries.length);
    expect(Array.isArray(parsed.primitives.available)).toBe(true);
    expect(Array.isArray(parsed.rules)).toBe(true);
  });

  it('package.json slugifies the product name', () => {
    const { plan } = compose(buildIntent({ productName: 'Heroku-Style PaaS for Next.js Apps!' }));
    const files = buildProjectFiles(plan);
    const pkg = files.find((f) => f.path === 'package.json');
    const parsed = JSON.parse(pkg!.contents);
    expect(parsed.name).toBe('heroku-style-paas-for-next-js-apps');
  });

  it('dedupes files when the same path is emitted twice', () => {
    const { plan } = compose(buildIntent());
    const files = buildProjectFiles(plan);
    const paths = files.map((f) => f.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('sorts files by path for deterministic output', () => {
    const { plan } = compose(buildIntent());
    const paths = buildProjectFiles(plan).map((f) => f.path);
    const sorted = [...paths].sort();
    expect(paths).toEqual(sorted);
  });
});
