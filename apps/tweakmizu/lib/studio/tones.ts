import type { Tone } from '@/types/studio';

export interface ToneMeta {
  id: Tone;
  label: string;
  description: string;
  /** Existing preset name in `utils/theme-presets.ts` to seed the theme with. */
  basePreset: string;
}

export const tones: ToneMeta[] = [
  {
    id: 'editorial',
    label: 'Editorial',
    description: 'Airy, serif-forward, thoughtful.',
    basePreset: 'default',
  },
  {
    id: 'technical',
    label: 'Technical',
    description: 'Dense, mono-friendly, precise.',
    basePreset: 'default',
  },
  {
    id: 'playful',
    label: 'Playful',
    description: 'Bold color, rounded, illustrative.',
    basePreset: 'default',
  },
  {
    id: 'corporate',
    label: 'Corporate',
    description: 'Restrained, sans, structured.',
    basePreset: 'default',
  },
  {
    id: 'brutalist',
    label: 'Brutalist',
    description: 'Sharp corners, high contrast, raw.',
    basePreset: 'default',
  },
];

export function getTone(id: Tone): ToneMeta | undefined {
  return tones.find((t) => t.id === id);
}
