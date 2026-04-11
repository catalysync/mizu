import type { ComponentType } from 'react';
import type { Industry } from '@/types/studio';

export type PatternKind = 'page' | 'section' | 'layout' | 'component' | 'interaction';

export type PatternTier = 'free' | 'pro';

export interface PatternSource {
  system: string;
  url?: string;
  relationship:
    | 'inspired-by'
    | 'ia-borrowed'
    | 'visual-rhythm'
    | 'interaction-borrowed'
    | 'concept-reference';
  notes?: string;
}

export interface PatternMeta {
  id: string;
  name: string;
  description: string;
  kind: PatternKind;
  industries: Industry[];
  tier: PatternTier;
  sources: PatternSource[];
  depends: string[];
}

export interface OutputFile {
  path: string;
  contents: string;
  executable?: boolean;
}

export interface RenderContext {
  productName: string;
  description: string;
}

export interface PatternModule {
  meta: PatternMeta;
  Preview: ComponentType;
  renderReact: (ctx: RenderContext) => OutputFile[];
}

export function definePattern(module: PatternModule): PatternModule {
  return module;
}
