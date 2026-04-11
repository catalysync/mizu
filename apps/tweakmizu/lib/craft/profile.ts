import { z } from 'zod';

/**
 * DesignLanguageProfile — the serializable artifact that describes a user's
 * design language on top of mizu. Organized as 10 clusters matching
 * mizu-planning/11-design-language.md. Every field has a default drawn from
 * the "mizu sample language" archetype.
 *
 * This is what gets exported as `mizu.language.json`, what the AI prompt
 * produces, and what the craft studio UI edits knob by knob.
 */

// -- Cluster A: Foundation -------------------------------------------------

export const HuePersonality = z.enum(['warm', 'cool', 'neutral', 'chromatic']);
export type HuePersonality = z.infer<typeof HuePersonality>;

export const ChromaIntensity = z.enum(['muted', 'balanced', 'vibrant']);
export type ChromaIntensity = z.infer<typeof ChromaIntensity>;

export const ContrastTier = z.enum(['aa-comfortable', 'aaa-conservative', 'editorial-high']);
export type ContrastTier = z.infer<typeof ContrastTier>;

export const DarkModePhilosophy = z.enum(['parallel', 'inverted', 'dim', 'none']);
export type DarkModePhilosophy = z.infer<typeof DarkModePhilosophy>;

export const FoundationCluster = z.object({
  brandHue: z.number().min(0).max(360),
  huePersonality: HuePersonality,
  chroma: ChromaIntensity,
  contrast: ContrastTier,
  darkMode: DarkModePhilosophy,
});
export type FoundationCluster = z.infer<typeof FoundationCluster>;

// -- Cluster B: Shape ------------------------------------------------------

export const RadiusScale = z.enum(['sharp', 'soft', 'pillowy', 'pill']);
export type RadiusScale = z.infer<typeof RadiusScale>;

export const BorderWeight = z.enum(['none', 'thin', 'medium', 'thick']);
export type BorderWeight = z.infer<typeof BorderWeight>;

export const ChromeStyle = z.enum(['flat', 'layered', 'material', 'paper']);
export type ChromeStyle = z.infer<typeof ChromeStyle>;

export const ShapeCluster = z.object({
  radius: RadiusScale,
  radiusUniform: z.boolean(),
  borderWeight: BorderWeight,
  chrome: ChromeStyle,
});
export type ShapeCluster = z.infer<typeof ShapeCluster>;

// -- Cluster C: Density ----------------------------------------------------

export const SpacingBase = z.enum(['4', '6', '8']);
export type SpacingBase = z.infer<typeof SpacingBase>;

export const DensityMode = z.enum(['comfortable', 'default', 'compact', 'data-dense']);
export type DensityMode = z.infer<typeof DensityMode>;

export const DensityCluster = z.object({
  spacingBase: SpacingBase,
  density: DensityMode,
  airyType: z.boolean(),
});
export type DensityCluster = z.infer<typeof DensityCluster>;

// -- Cluster D: Type -------------------------------------------------------

export const TypeFamilyKind = z.enum([
  'sans-humanist',
  'sans-geometric',
  'sans-grotesque',
  'sans-display',
  'serif',
  'mono-primary',
]);
export type TypeFamilyKind = z.infer<typeof TypeFamilyKind>;

export const ScaleRatio = z.enum([
  'minor-second',
  'major-second',
  'minor-third',
  'major-third',
  'perfect-fourth',
]);
export type ScaleRatio = z.infer<typeof ScaleRatio>;

export const WeightVocabulary = z.enum(['duo', 'trio', 'full']);
export type WeightVocabulary = z.infer<typeof WeightVocabulary>;

export const TypeCluster = z.object({
  sansFamily: z.string(),
  sansKind: TypeFamilyKind,
  monoFamily: z.string(),
  scaleRatio: ScaleRatio,
  weights: WeightVocabulary,
  trackingTight: z.boolean(),
});
export type TypeCluster = z.infer<typeof TypeCluster>;

// -- Cluster E: Motion -----------------------------------------------------

export const EasingFamily = z.enum(['calm', 'balanced', 'spring', 'snappy']);
export type EasingFamily = z.infer<typeof EasingFamily>;

export const DurationScale = z.enum(['tight', 'medium', 'relaxed']);
export type DurationScale = z.infer<typeof DurationScale>;

export const ReducedMotionStance = z.enum(['respect-subtle', 'kill-all']);
export type ReducedMotionStance = z.infer<typeof ReducedMotionStance>;

export const MotionCluster = z.object({
  easing: EasingFamily,
  duration: DurationScale,
  reducedMotion: ReducedMotionStance,
});
export type MotionCluster = z.infer<typeof MotionCluster>;

// -- Cluster F: Depth ------------------------------------------------------

export const DepthRecipe = z.enum(['shadows', 'borders', 'surfaces', 'flat']);
export type DepthRecipe = z.infer<typeof DepthRecipe>;

export const ShadowFlavor = z.enum(['sharp-near', 'soft-diffuse', 'tinted', 'none']);
export type ShadowFlavor = z.infer<typeof ShadowFlavor>;

export const DepthCluster = z.object({
  recipe: DepthRecipe,
  shadowFlavor: ShadowFlavor,
});
export type DepthCluster = z.infer<typeof DepthCluster>;

// -- Cluster G: Focus ------------------------------------------------------

export const FocusStyle = z.enum(['outline', 'shadow', 'bg-shift']);
export type FocusStyle = z.infer<typeof FocusStyle>;

export const FocusCluster = z.object({
  style: FocusStyle,
  color: z.enum(['accent', 'dedicated', 'high-contrast']),
  width: z.enum(['1px', '2px', '3px']),
});
export type FocusCluster = z.infer<typeof FocusCluster>;

// -- Cluster H: Iconography ------------------------------------------------

export const IconStyle = z.enum(['line', 'filled', 'duotone']);
export type IconStyle = z.infer<typeof IconStyle>;

export const IconographyCluster = z.object({
  style: IconStyle,
  strokeWeight: z.enum(['1', '1.5', '2', '2.5']),
  cornerStyle: z.enum(['sharp', 'rounded', 'organic']),
  sizeScale: z.enum(['16-20-24', '14-18-22']),
});
export type IconographyCluster = z.infer<typeof IconographyCluster>;

// -- Cluster I: Voice ------------------------------------------------------

export const VoiceRegister = z.enum(['formal', 'neutral', 'friendly', 'playful']);
export type VoiceRegister = z.infer<typeof VoiceRegister>;

export const ErrorTone = z.enum(['blame-user', 'blame-nothing', 'apologetic-system']);
export type ErrorTone = z.infer<typeof ErrorTone>;

export const VoiceCluster = z.object({
  register: VoiceRegister,
  errorTone: ErrorTone,
  emptyState: z.enum(['celebratory', 'factual', 'illustrated', 'minimal']),
  destructiveVerb: z.enum(['delete', 'remove', 'archive']),
});
export type VoiceCluster = z.infer<typeof VoiceCluster>;

// -- Cluster J: API opinions -----------------------------------------------

export const OpinionCluster = z.object({
  alertNamingProp: z.enum(['type', 'variant', 'tone', 'status']),
  buttonHierarchyProp: z.enum(['variant', 'emphasis', 'priority']),
  compositionStyle: z.enum(['compound', 'slot']),
  loadingOwnership: z.enum(['design-system', 'consumer']),
});
export type OpinionCluster = z.infer<typeof OpinionCluster>;

// -- The full profile -----------------------------------------------------

export const DesignLanguageProfile = z.object({
  $schema: z.string().default('https://mizu.dev/language.schema.json'),
  version: z.literal(1).default(1),
  name: z.string().default('Untitled language'),
  description: z.string().optional(),
  archetype: z.string().optional(),
  foundation: FoundationCluster,
  shape: ShapeCluster,
  density: DensityCluster,
  type: TypeCluster,
  motion: MotionCluster,
  depth: DepthCluster,
  focus: FocusCluster,
  iconography: IconographyCluster,
  voice: VoiceCluster,
  opinions: OpinionCluster,
});
export type DesignLanguageProfile = z.infer<typeof DesignLanguageProfile>;

/**
 * The mizu sample language. Not the system's opinion — just a reasonable
 * starting point. Every archetype starts by cloning this and overriding.
 */
export const mizuSampleProfile: DesignLanguageProfile = {
  $schema: 'https://mizu.dev/language.schema.json',
  version: 1,
  name: 'mizu sample',
  description: 'The neutral default mizu ships with. One possible language, not the system’s.',
  archetype: 'mizu-default',
  foundation: {
    brandHue: 220,
    huePersonality: 'cool',
    chroma: 'balanced',
    contrast: 'aa-comfortable',
    darkMode: 'parallel',
  },
  shape: {
    radius: 'soft',
    radiusUniform: true,
    borderWeight: 'thin',
    chrome: 'layered',
  },
  density: {
    spacingBase: '4',
    density: 'default',
    airyType: false,
  },
  type: {
    sansFamily: 'Inter',
    sansKind: 'sans-humanist',
    monoFamily: 'JetBrains Mono',
    scaleRatio: 'minor-third',
    weights: 'trio',
    trackingTight: false,
  },
  motion: {
    easing: 'calm',
    duration: 'medium',
    reducedMotion: 'respect-subtle',
  },
  depth: {
    recipe: 'borders',
    shadowFlavor: 'soft-diffuse',
  },
  focus: {
    style: 'shadow',
    color: 'accent',
    width: '2px',
  },
  iconography: {
    style: 'line',
    strokeWeight: '2',
    cornerStyle: 'rounded',
    sizeScale: '16-20-24',
  },
  voice: {
    register: 'neutral',
    errorTone: 'blame-nothing',
    emptyState: 'factual',
    destructiveVerb: 'delete',
  },
  opinions: {
    alertNamingProp: 'tone',
    buttonHierarchyProp: 'variant',
    compositionStyle: 'compound',
    loadingOwnership: 'design-system',
  },
};

/**
 * Parse + validate any incoming profile. Throws if invalid. Use this when
 * loading a profile from JSON, from the AI response, or from an import.
 */
export function parseProfile(input: unknown): DesignLanguageProfile {
  return DesignLanguageProfile.parse(input);
}

/**
 * Safe parse that returns null on failure — use in UIs where you want to
 * fall back to a default rather than throw.
 */
export function safeParseProfile(input: unknown): DesignLanguageProfile | null {
  const result = DesignLanguageProfile.safeParse(input);
  return result.success ? result.data : null;
}
