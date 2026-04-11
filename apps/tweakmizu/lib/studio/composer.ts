import { filterPatterns, getPattern } from '@/lib/patterns/registry';
import type { PatternModule } from '@/lib/patterns/types';
import type { IntentSpec } from '@/types/studio';

export interface PlanEntry {
  patternId: string;
  route: string;
  title: string;
}

export interface Plan {
  id: string;
  intent: IntentSpec;
  entries: PlanEntry[];
  unusedPatternIds: string[];
  rationale: string;
  createdAt: string;
}

export interface ComposerResult {
  plan: Plan;
  fallback: boolean;
}

function slugifyRoute(slug: string): string {
  if (!slug) return '/';
  if (slug.startsWith('/')) return slug;
  return `/${slug}`;
}

function pickBestPattern(
  candidates: PatternModule[],
  page: { slug: string; label: string },
): PatternModule | undefined {
  const token = page.label.toLowerCase();
  const slugToken = page.slug.toLowerCase();
  return (
    candidates.find((p) => {
      const id = p.meta.id.toLowerCase();
      return id.includes(token) || id.includes(slugToken) || token.includes(id.split('.')[1] ?? '');
    }) ?? candidates[0]
  );
}

export function compose(intent: IntentSpec): ComposerResult {
  const candidates = filterPatterns({ industry: intent.industry, tier: 'free' });
  const fallbackCandidates = candidates.length > 0 ? candidates : filterPatterns({ tier: 'free' });

  const usedIds = new Set<string>();
  const entries: PlanEntry[] = [];

  for (const page of intent.pages) {
    const remaining = fallbackCandidates.filter((p) => !usedIds.has(p.meta.id));
    const pool = remaining.length > 0 ? remaining : fallbackCandidates;
    const picked = pickBestPattern(pool, page);
    if (!picked) continue;
    usedIds.add(picked.meta.id);
    entries.push({
      patternId: picked.meta.id,
      route: slugifyRoute(page.slug),
      title: page.label,
    });
  }

  const unusedPatternIds = fallbackCandidates
    .map((p) => p.meta.id)
    .filter((id) => !usedIds.has(id));

  const plan: Plan = {
    id: `plan-${Date.now()}`,
    intent,
    entries,
    unusedPatternIds,
    rationale: buildRationale(intent, entries),
    createdAt: new Date().toISOString(),
  };

  return { plan, fallback: candidates.length === 0 };
}

function buildRationale(intent: IntentSpec, entries: PlanEntry[]): string {
  if (entries.length === 0) {
    return `No free-tier patterns matched ${intent.industry}. Using fallback cloud patterns.`;
  }
  const industryLabel = intent.industry.replace('-', ' ');
  const patternList = entries.map((e) => e.patternId).join(', ');
  return `Composed a ${intent.tone} ${industryLabel} starter using ${entries.length} free-tier patterns (${patternList}). Theme seeded from the ${intent.tone} preset.`;
}

export function resolvePatternsForPlan(plan: Plan): PatternModule[] {
  return plan.entries
    .map((entry) => getPattern(entry.patternId))
    .filter((p): p is PatternModule => p !== undefined);
}
