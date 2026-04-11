import { z } from 'zod';
import type { ThemeEditorState } from './editor';

export const industrySchema = z.enum([
  'cloud',
  'saas-admin',
  'ecommerce',
  'fintech',
  'editorial',
  'ai-product',
  'devtools',
  'other',
]);

export type Industry = z.infer<typeof industrySchema>;

export const stackSchema = z.enum(['next-app-router', 'html-css', 'svelte', 'vue', 'alpine']);

export type Stack = z.infer<typeof stackSchema>;

export const densityModeSchema = z.enum(['compact', 'default', 'spacious']);
export type DensityMode = z.infer<typeof densityModeSchema>;

export const toneSchema = z.enum(['editorial', 'technical', 'playful', 'corporate', 'brutalist']);
export type Tone = z.infer<typeof toneSchema>;

export const pageIntentSchema = z.object({
  slug: z.string().min(1).max(60),
  label: z.string().min(1).max(80),
});
export type PageIntent = z.infer<typeof pageIntentSchema>;

export const intentSpecSchema = z.object({
  productName: z.string().min(1).max(80),
  description: z.string().min(1).max(240),
  industry: industrySchema,
  stack: stackSchema,
  tone: toneSchema,
  density: densityModeSchema.default('default'),
  pages: z.array(pageIntentSchema).min(1).max(20),
  refinement: z.string().max(500).optional(),
});
export type IntentSpec = z.infer<typeof intentSpecSchema>;

export interface StudioLayoutExtensions {
  stack: { gap: string; align: 'stretch' | 'start' | 'center' | 'end' };
  cluster: {
    gap: string;
    align: 'start' | 'center' | 'end';
    justify: 'start' | 'center' | 'end' | 'between';
  };
  switcher: { threshold: string; gap: string };
  center: { maxWidth: string; gutter: string };
  sidebar: { sideMin: string; contentMin: string; gap: string };
  cover: { minHeight: string; contentPad: string };
  grid: { minItem: string; gap: string };
  frame: { ratio: string };
  reel: { itemWidth: string; gap: string };
  imposter: { offset: string };
}

export interface StudioDensityExtensions {
  mode: DensityMode;
  spacingMultiplier: number;
  typographyShift: number;
  componentPadding: 'tight' | 'standard' | 'loose';
}

export interface StudioMotionExtensions {
  duration: {
    instant: string;
    fast: string;
    moderate: string;
    slow: string;
    slower: string;
  };
  easing: {
    standard: string;
    decelerate: string;
    accelerate: string;
    emphasized: string;
  };
  reducedMotion: { duration: string; easing: string };
}

export interface StudioA11yExtensions {
  minTouchTarget: string;
  contrastLevel: 'AA' | 'AAA' | 'APCA-Lc60' | 'APCA-Lc75';
  reducedMotionDefault: 'respect' | 'always-reduce' | 'ignore';
}

export interface StudioComponentExtension {
  variants?: Record<string, { enabled: boolean }>;
  overrides?: Record<string, string>;
}

export interface StudioCatalogSelection {
  selectedPatternIds: string[];
}

export interface StudioThemeExtensions {
  layout: StudioLayoutExtensions;
  density: StudioDensityExtensions;
  motion: StudioMotionExtensions;
  a11y: StudioA11yExtensions;
  components: Record<string, StudioComponentExtension>;
  catalog: StudioCatalogSelection;
}

export interface StudioThemeState extends ThemeEditorState {
  extensions: StudioThemeExtensions;
}
