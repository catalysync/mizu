import type { Industry } from '@/types/studio';
import { cloudActivity } from '@/catalog/cloud/activity';
import { cloudApps } from '@/catalog/cloud/apps';
import { cloudBilling } from '@/catalog/cloud/billing';
import { cloudSettings } from '@/catalog/cloud/settings';
import { cloudTemplates } from '@/catalog/cloud/templates';
import type { PatternModule, PatternTier } from './types';

export const patternRegistry: PatternModule[] = [
  cloudApps,
  cloudActivity,
  cloudTemplates,
  cloudBilling,
  cloudSettings,
];

export function getAllPatterns(): PatternModule[] {
  return patternRegistry;
}

export function getPattern(id: string): PatternModule | undefined {
  return patternRegistry.find((p) => p.meta.id === id);
}

export interface PatternFilter {
  industry?: Industry;
  tier?: PatternTier;
  kind?: PatternModule['meta']['kind'];
}

export function filterPatterns(filter: PatternFilter = {}): PatternModule[] {
  return patternRegistry.filter((p) => {
    if (filter.industry && !p.meta.industries.includes(filter.industry)) return false;
    if (filter.tier && p.meta.tier !== filter.tier) return false;
    if (filter.kind && p.meta.kind !== filter.kind) return false;
    return true;
  });
}

export function getPatternsByIndustry(industry: Industry): PatternModule[] {
  return patternRegistry.filter((p) => p.meta.industries.includes(industry));
}

export function getFreePatterns(): PatternModule[] {
  return patternRegistry.filter((p) => p.meta.tier === 'free');
}
