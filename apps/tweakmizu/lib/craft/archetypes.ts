import type { DesignLanguageProfile } from './profile';
import { mizuSampleProfile } from './profile';

/**
 * Archetype presets — fast starting points for designers and founders.
 * Each one is a full DesignLanguageProfile derived from the mizu sample
 * with specific cluster overrides. The "why" strings become teaching
 * chips in the craft studio UI so users learn the trade-offs they're
 * choosing between.
 */

export interface Archetype {
  id: string;
  name: string;
  tagline: string;
  description: string;
  inspiredBy: string;
  pro?: boolean;
  profile: DesignLanguageProfile;
}

function clone(base: DesignLanguageProfile): DesignLanguageProfile {
  return JSON.parse(JSON.stringify(base));
}

export const archetypes: Archetype[] = [
  {
    id: 'mizu-default',
    name: 'mizu sample',
    tagline: 'The neutral default',
    description:
      'Start here if you want a reasonable baseline you can nudge in any direction. Cool blue, soft 6px radius, humanist sans, calm motion.',
    inspiredBy: 'mizu itself',
    profile: mizuSampleProfile,
  },
  {
    id: 'stripe-like',
    name: 'Ledger',
    tagline: 'Confident, technical, enterprise-ready',
    description:
      'Muted slate palette, soft 8px radius, humanist sans, ease-out motion. Feels serious without being cold.',
    inspiredBy: 'Stripe dashboard, Mercury, Ramp',
    profile: {
      ...clone(mizuSampleProfile),
      name: 'Ledger',
      archetype: 'stripe-like',
      foundation: {
        brandHue: 240,
        huePersonality: 'cool',
        chroma: 'muted',
        contrast: 'aa-comfortable',
        darkMode: 'parallel',
      },
      shape: {
        radius: 'soft',
        radiusUniform: true,
        borderWeight: 'thin',
        chrome: 'layered',
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
      voice: {
        register: 'neutral',
        errorTone: 'apologetic-system',
        emptyState: 'factual',
        destructiveVerb: 'delete',
      },
    },
  },
  {
    id: 'notion-like',
    name: 'Parchment',
    tagline: 'Warm, calm, document-first',
    description:
      'Cream neutrals, sharp 4px radius, geometric sans, ease-in-out motion. For tools people live inside all day.',
    inspiredBy: 'Notion, Craft, Roam',
    profile: {
      ...clone(mizuSampleProfile),
      name: 'Parchment',
      archetype: 'notion-like',
      foundation: {
        brandHue: 30,
        huePersonality: 'warm',
        chroma: 'muted',
        contrast: 'aa-comfortable',
        darkMode: 'dim',
      },
      shape: {
        radius: 'sharp',
        radiusUniform: true,
        borderWeight: 'thin',
        chrome: 'flat',
      },
      density: {
        spacingBase: '4',
        density: 'comfortable',
        airyType: true,
      },
      type: {
        sansFamily: 'Inter',
        sansKind: 'sans-geometric',
        monoFamily: 'JetBrains Mono',
        scaleRatio: 'minor-third',
        weights: 'trio',
        trackingTight: false,
      },
      motion: {
        easing: 'balanced',
        duration: 'medium',
        reducedMotion: 'respect-subtle',
      },
      voice: {
        register: 'friendly',
        errorTone: 'blame-nothing',
        emptyState: 'illustrated',
        destructiveVerb: 'archive',
      },
    },
  },
  {
    id: 'linear-like',
    name: 'Graphite',
    tagline: 'Direct, fast, cold',
    description:
      'Near-black backgrounds, 6px radius, display sans, spring motion. For teams that prize keyboard speed over warmth.',
    inspiredBy: 'Linear, Height, Arc',
    profile: {
      ...clone(mizuSampleProfile),
      name: 'Graphite',
      archetype: 'linear-like',
      foundation: {
        brandHue: 260,
        huePersonality: 'cool',
        chroma: 'muted',
        contrast: 'editorial-high',
        darkMode: 'parallel',
      },
      shape: {
        radius: 'soft',
        radiusUniform: true,
        borderWeight: 'thin',
        chrome: 'flat',
      },
      density: {
        spacingBase: '6',
        density: 'compact',
        airyType: false,
      },
      type: {
        sansFamily: 'Inter Display',
        sansKind: 'sans-display',
        monoFamily: 'Berkeley Mono',
        scaleRatio: 'major-third',
        weights: 'trio',
        trackingTight: true,
      },
      motion: {
        easing: 'spring',
        duration: 'tight',
        reducedMotion: 'respect-subtle',
      },
      voice: {
        register: 'neutral',
        errorTone: 'blame-nothing',
        emptyState: 'minimal',
        destructiveVerb: 'delete',
      },
    },
  },
  {
    id: 'braun-like',
    name: 'Grid',
    tagline: 'Precise, functional, data-dense',
    description:
      'Warm neutrals, sharp 2px radius, grotesque sans, snappy motion. For dashboards and tools where every pixel carries information.',
    inspiredBy: 'Braun, Swiss design, Bloomberg terminal',
    profile: {
      ...clone(mizuSampleProfile),
      name: 'Grid',
      archetype: 'braun-like',
      foundation: {
        brandHue: 20,
        huePersonality: 'neutral',
        chroma: 'muted',
        contrast: 'editorial-high',
        darkMode: 'parallel',
      },
      shape: {
        radius: 'sharp',
        radiusUniform: true,
        borderWeight: 'thin',
        chrome: 'flat',
      },
      density: {
        spacingBase: '4',
        density: 'data-dense',
        airyType: false,
      },
      type: {
        sansFamily: 'IBM Plex Sans',
        sansKind: 'sans-grotesque',
        monoFamily: 'IBM Plex Mono',
        scaleRatio: 'major-second',
        weights: 'trio',
        trackingTight: false,
      },
      motion: {
        easing: 'snappy',
        duration: 'tight',
        reducedMotion: 'respect-subtle',
      },
      depth: {
        recipe: 'borders',
        shadowFlavor: 'none',
      },
      voice: {
        register: 'formal',
        errorTone: 'blame-nothing',
        emptyState: 'factual',
        destructiveVerb: 'delete',
      },
    },
  },
  {
    id: 'brutalist',
    name: 'Slab',
    tagline: 'Raw, high-contrast, opinionated',
    description:
      'Stark black-and-white, zero radius, mono-primary type, no motion. For portfolios and tools that want to be noticed.',
    inspiredBy: 'Vercel early, V0, bauhaus zines',
    profile: {
      ...clone(mizuSampleProfile),
      name: 'Slab',
      archetype: 'brutalist',
      foundation: {
        brandHue: 0,
        huePersonality: 'neutral',
        chroma: 'muted',
        contrast: 'editorial-high',
        darkMode: 'inverted',
      },
      shape: {
        radius: 'sharp',
        radiusUniform: true,
        borderWeight: 'thick',
        chrome: 'flat',
      },
      density: {
        spacingBase: '8',
        density: 'compact',
        airyType: false,
      },
      type: {
        sansFamily: 'JetBrains Mono',
        sansKind: 'mono-primary',
        monoFamily: 'JetBrains Mono',
        scaleRatio: 'major-third',
        weights: 'duo',
        trackingTight: false,
      },
      motion: {
        easing: 'snappy',
        duration: 'tight',
        reducedMotion: 'kill-all',
      },
      depth: {
        recipe: 'borders',
        shadowFlavor: 'none',
      },
      focus: {
        style: 'outline',
        color: 'high-contrast',
        width: '3px',
      },
      voice: {
        register: 'neutral',
        errorTone: 'blame-user',
        emptyState: 'minimal',
        destructiveVerb: 'delete',
      },
    },
  },
  // -- Pro archetypes -------------------------------------------------------
  {
    id: 'apple-hig',
    name: 'Mercury',
    tagline: 'Premium, warm, human',
    description:
      'Warm neutrals, pillowy 16px radius, SF Pro-style sans, calm motion. The "expensive" feel of consumer premium apps.',
    inspiredBy: 'Apple HIG, Things 3, Craft',
    pro: true,
    profile: {
      ...clone(mizuSampleProfile),
      name: 'Mercury',
      archetype: 'apple-hig',
      foundation: {
        brandHue: 210,
        huePersonality: 'warm',
        chroma: 'balanced',
        contrast: 'aa-comfortable',
        darkMode: 'parallel',
      },
      shape: { radius: 'pillowy', radiusUniform: true, borderWeight: 'none', chrome: 'layered' },
      density: { spacingBase: '8', density: 'comfortable', airyType: true },
      type: {
        sansFamily: 'SF Pro Display',
        sansKind: 'sans-humanist',
        monoFamily: 'SF Mono',
        scaleRatio: 'minor-third',
        weights: 'trio',
        trackingTight: true,
      },
      motion: { easing: 'spring', duration: 'medium', reducedMotion: 'respect-subtle' },
      depth: { recipe: 'shadows', shadowFlavor: 'soft-diffuse' },
      voice: {
        register: 'friendly',
        errorTone: 'apologetic-system',
        emptyState: 'illustrated',
        destructiveVerb: 'remove',
      },
    },
  },
  {
    id: 'geist-like',
    name: 'Vapor',
    tagline: 'Minimal, monochrome, precise',
    description:
      '10-step gray scale, soft radius, geometric sans, tight motion. The Vercel aesthetic — says more with less.',
    inspiredBy: 'Vercel/Geist, Resend, Cal.com',
    pro: true,
    profile: {
      ...clone(mizuSampleProfile),
      name: 'Vapor',
      archetype: 'geist-like',
      foundation: {
        brandHue: 0,
        huePersonality: 'neutral',
        chroma: 'muted',
        contrast: 'aa-comfortable',
        darkMode: 'parallel',
      },
      shape: { radius: 'soft', radiusUniform: true, borderWeight: 'thin', chrome: 'flat' },
      density: { spacingBase: '4', density: 'compact', airyType: false },
      type: {
        sansFamily: 'Geist',
        sansKind: 'sans-geometric',
        monoFamily: 'Geist Mono',
        scaleRatio: 'major-second',
        weights: 'trio',
        trackingTight: true,
      },
      motion: { easing: 'snappy', duration: 'tight', reducedMotion: 'respect-subtle' },
      depth: { recipe: 'borders', shadowFlavor: 'none' },
      voice: {
        register: 'neutral',
        errorTone: 'blame-nothing',
        emptyState: 'minimal',
        destructiveVerb: 'delete',
      },
    },
  },
  {
    id: 'figma-like',
    name: 'Signal',
    tagline: 'Vibrant, creative, tool-first',
    description:
      'Purple-blue hue, vibrant chroma, pill buttons, spring motion. For creative tools where the UI is part of the experience.',
    inspiredBy: 'Figma, Framer, Raycast',
    pro: true,
    profile: {
      ...clone(mizuSampleProfile),
      name: 'Signal',
      archetype: 'figma-like',
      foundation: {
        brandHue: 262,
        huePersonality: 'chromatic',
        chroma: 'vibrant',
        contrast: 'aa-comfortable',
        darkMode: 'parallel',
      },
      shape: { radius: 'pillowy', radiusUniform: false, borderWeight: 'thin', chrome: 'layered' },
      density: { spacingBase: '4', density: 'default', airyType: false },
      type: {
        sansFamily: 'Inter',
        sansKind: 'sans-humanist',
        monoFamily: 'Fira Code',
        scaleRatio: 'minor-third',
        weights: 'full',
        trackingTight: false,
      },
      motion: { easing: 'spring', duration: 'medium', reducedMotion: 'respect-subtle' },
      depth: { recipe: 'shadows', shadowFlavor: 'tinted' },
      voice: {
        register: 'friendly',
        errorTone: 'blame-nothing',
        emptyState: 'celebratory',
        destructiveVerb: 'remove',
      },
    },
  },
  {
    id: 'enterprise',
    name: 'Sage',
    tagline: 'Accessible, enterprise, compliant',
    description:
      'AAA contrast, soft radius, grotesque sans, calm motion. For regulated industries where accessibility is a legal requirement.',
    inspiredBy: 'IBM Carbon, Sage DS, GOV.UK',
    pro: true,
    profile: {
      ...clone(mizuSampleProfile),
      name: 'Sage',
      archetype: 'enterprise',
      foundation: {
        brandHue: 160,
        huePersonality: 'cool',
        chroma: 'muted',
        contrast: 'aaa-conservative',
        darkMode: 'parallel',
      },
      shape: { radius: 'soft', radiusUniform: true, borderWeight: 'thin', chrome: 'layered' },
      density: { spacingBase: '8', density: 'default', airyType: false },
      type: {
        sansFamily: 'IBM Plex Sans',
        sansKind: 'sans-grotesque',
        monoFamily: 'IBM Plex Mono',
        scaleRatio: 'minor-third',
        weights: 'trio',
        trackingTight: false,
      },
      motion: { easing: 'calm', duration: 'medium', reducedMotion: 'respect-subtle' },
      depth: { recipe: 'borders', shadowFlavor: 'soft-diffuse' },
      focus: { style: 'outline', color: 'high-contrast', width: '3px' },
      voice: {
        register: 'formal',
        errorTone: 'blame-nothing',
        emptyState: 'factual',
        destructiveVerb: 'remove',
      },
    },
  },
  {
    id: 'neon',
    name: 'Neon',
    tagline: 'Dark, vivid, immersive',
    description:
      'Deep dark base, vivid accent, pill radius, spring motion. For gaming, crypto, and entertainment products.',
    inspiredBy: 'Discord, Warp terminal, pump.fun',
    pro: true,
    profile: {
      ...clone(mizuSampleProfile),
      name: 'Neon',
      archetype: 'neon',
      foundation: {
        brandHue: 280,
        huePersonality: 'chromatic',
        chroma: 'vibrant',
        contrast: 'editorial-high',
        darkMode: 'inverted',
      },
      shape: { radius: 'pill', radiusUniform: false, borderWeight: 'none', chrome: 'material' },
      density: { spacingBase: '4', density: 'compact', airyType: false },
      type: {
        sansFamily: 'Space Grotesk',
        sansKind: 'sans-geometric',
        monoFamily: 'JetBrains Mono',
        scaleRatio: 'major-third',
        weights: 'duo',
        trackingTight: true,
      },
      motion: { easing: 'spring', duration: 'tight', reducedMotion: 'kill-all' },
      depth: { recipe: 'shadows', shadowFlavor: 'tinted' },
      voice: {
        register: 'playful',
        errorTone: 'blame-nothing',
        emptyState: 'celebratory',
        destructiveVerb: 'delete',
      },
    },
  },
  {
    id: 'editorial',
    name: 'Paper',
    tagline: 'Elegant, serif-forward, editorial',
    description:
      'Warm neutrals, sharp radius, serif type, relaxed motion. For publishing, blogs, and content platforms.',
    inspiredBy: 'Substack, Medium, The New York Times',
    pro: true,
    profile: {
      ...clone(mizuSampleProfile),
      name: 'Paper',
      archetype: 'editorial',
      foundation: {
        brandHue: 25,
        huePersonality: 'warm',
        chroma: 'muted',
        contrast: 'aa-comfortable',
        darkMode: 'dim',
      },
      shape: { radius: 'sharp', radiusUniform: true, borderWeight: 'thin', chrome: 'paper' },
      density: { spacingBase: '8', density: 'comfortable', airyType: true },
      type: {
        sansFamily: 'Playfair Display',
        sansKind: 'serif',
        monoFamily: 'JetBrains Mono',
        scaleRatio: 'perfect-fourth',
        weights: 'full',
        trackingTight: false,
      },
      motion: { easing: 'balanced', duration: 'relaxed', reducedMotion: 'respect-subtle' },
      depth: { recipe: 'surfaces', shadowFlavor: 'none' },
      voice: {
        register: 'neutral',
        errorTone: 'blame-nothing',
        emptyState: 'illustrated',
        destructiveVerb: 'archive',
      },
    },
  },
  {
    id: 'healthcare',
    name: 'Coral',
    tagline: 'Calm, trustworthy, accessible',
    description:
      'Teal-green hue, soft radius, humanist sans, calm motion. For healthcare, wellness, and apps where trust is the product.',
    inspiredBy: 'Doctolib, Headspace, One Medical',
    pro: true,
    profile: {
      ...clone(mizuSampleProfile),
      name: 'Coral',
      archetype: 'healthcare',
      foundation: {
        brandHue: 174,
        huePersonality: 'cool',
        chroma: 'balanced',
        contrast: 'aaa-conservative',
        darkMode: 'none',
      },
      shape: { radius: 'soft', radiusUniform: true, borderWeight: 'thin', chrome: 'layered' },
      density: { spacingBase: '8', density: 'comfortable', airyType: true },
      type: {
        sansFamily: 'Source Sans 3',
        sansKind: 'sans-humanist',
        monoFamily: 'Source Code Pro',
        scaleRatio: 'minor-third',
        weights: 'trio',
        trackingTight: false,
      },
      motion: { easing: 'calm', duration: 'relaxed', reducedMotion: 'respect-subtle' },
      depth: { recipe: 'shadows', shadowFlavor: 'soft-diffuse' },
      focus: { style: 'outline', color: 'accent', width: '2px' },
      voice: {
        register: 'friendly',
        errorTone: 'apologetic-system',
        emptyState: 'illustrated',
        destructiveVerb: 'remove',
      },
    },
  },
  {
    id: 'gov',
    name: 'Slate',
    tagline: 'Institutional, high-contrast, no-nonsense',
    description:
      'Blue-gray hue, AAA contrast, sharp radius, grotesque sans. For government, legal, and regulated sectors.',
    inspiredBy: 'GOV.UK, USDS, EU design system',
    pro: true,
    profile: {
      ...clone(mizuSampleProfile),
      name: 'Slate',
      archetype: 'gov',
      foundation: {
        brandHue: 210,
        huePersonality: 'cool',
        chroma: 'muted',
        contrast: 'aaa-conservative',
        darkMode: 'none',
      },
      shape: { radius: 'sharp', radiusUniform: true, borderWeight: 'medium', chrome: 'flat' },
      density: { spacingBase: '8', density: 'default', airyType: false },
      type: {
        sansFamily: 'Noto Sans',
        sansKind: 'sans-grotesque',
        monoFamily: 'Noto Sans Mono',
        scaleRatio: 'minor-third',
        weights: 'trio',
        trackingTight: false,
      },
      motion: { easing: 'calm', duration: 'medium', reducedMotion: 'respect-subtle' },
      depth: { recipe: 'borders', shadowFlavor: 'none' },
      focus: { style: 'outline', color: 'high-contrast', width: '3px' },
      voice: {
        register: 'formal',
        errorTone: 'blame-nothing',
        emptyState: 'factual',
        destructiveVerb: 'delete',
      },
    },
  },
];

export function archetypeById(id: string): Archetype | undefined {
  return archetypes.find((a) => a.id === id);
}
