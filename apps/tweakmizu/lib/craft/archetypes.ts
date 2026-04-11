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
];

export function archetypeById(id: string): Archetype | undefined {
  return archetypes.find((a) => a.id === id);
}
