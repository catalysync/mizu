/**
 * Button configuration — variant names, size presets, and type constants
 * extracted from the component for reuse by ButtonBar, SplitButton, and
 * theme generators. Follows sage-carbon's component .config.ts pattern.
 */

export const BUTTON_VARIANTS = [
  'primary',
  'secondary',
  'ghost',
  'destructive',
  'gradient',
] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export const BUTTON_SIZES = ['sm', 'md', 'lg', 'icon'] as const;

export type ButtonSize = (typeof BUTTON_SIZES)[number];

export const BUTTON_DEFAULTS = {
  variant: 'primary' as ButtonVariant,
  size: 'md' as ButtonSize,
  type: 'button' as const,
} as const;
