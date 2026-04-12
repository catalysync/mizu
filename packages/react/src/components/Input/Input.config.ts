export const INPUT_SIZES = ['sm', 'md', 'lg'] as const;
export type InputSize = (typeof INPUT_SIZES)[number];

export const INPUT_APPEARANCES = ['outline', 'filled', 'underline'] as const;
export type InputAppearance = (typeof INPUT_APPEARANCES)[number];

export const INPUT_DEFAULTS = {
  size: 'md' as InputSize,
  appearance: 'outline' as InputAppearance,
  type: 'text',
} as const;
