import { z } from 'zod';

/**
 * Mizu theme style properties — maps 1:1 to --mizu-* CSS custom properties.
 * Grouped by token tier: colors (action, feedback, surface, text, border),
 * radius, shadows, typography, and motion.
 */
export const themeStylePropsSchema = z.object({
  // --- Action colors ---
  'action-primary-default': z.string().describe('Primary action color (buttons, links)'),
  'action-primary-hover': z.string(),
  'action-primary-active': z.string(),
  'action-primary-disabled': z.string(),
  'action-destructive-default': z.string(),
  'action-destructive-hover': z.string(),
  'action-destructive-active': z.string(),
  'action-destructive-disabled': z.string(),

  // --- Feedback colors ---
  'feedback-success-default': z.string(),
  'feedback-success-subtle': z.string(),
  'feedback-warning-default': z.string(),
  'feedback-warning-subtle': z.string(),
  'feedback-danger-default': z.string(),
  'feedback-danger-subtle': z.string(),

  // --- Surface colors ---
  'surface-default': z.string().describe('Default page/card background'),
  'surface-secondary': z.string(),
  'surface-inverse': z.string(),

  // --- Text colors ---
  'text-primary': z.string().describe('Primary body text'),
  'text-secondary': z.string(),
  'text-inverse': z.string(),
  'text-disabled': z.string(),

  // --- Border colors ---
  'border-default': z.string(),
  'border-strong': z.string(),

  // --- Radius ---
  'radius-sm': z.string(),
  'radius-md': z.string(),
  'radius-lg': z.string(),
  'radius-xl': z.string(),

  // --- Shadows ---
  'shadow-sm': z.string(),
  'shadow-md': z.string(),
  'shadow-lg': z.string(),
  'shadow-xl': z.string(),

  // --- Typography ---
  'font-family-sans': z.string().describe('Primary UI font family'),
  'font-family-mono': z.string().describe('Monospace font family'),
  'font-weight-regular': z.string().optional(),
  'font-weight-medium': z.string().optional(),
  'font-weight-semibold': z.string().optional(),
  'font-weight-bold': z.string().optional(),

  // --- Motion ---
  'duration-fast': z.string().optional(),
  'duration-normal': z.string().optional(),
  'easing-out': z.string().optional(),
});

export type ThemeStyleProps = z.infer<typeof themeStylePropsSchema>;

export type ThemePreset = {
  label: string;
  description?: string;
  styles: Partial<ThemeStyleProps>;
  source?: 'BUILT_IN' | 'SAVED';
};

export type ThemeEditorPreviewProps = {
  styles: ThemeStyleProps;
  currentMode: 'light' | 'dark';
};
