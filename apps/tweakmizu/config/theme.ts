import { ThemeStyleProps } from '@/types/theme';
import { ThemeEditorState } from '@/types/editor';

/**
 * Default mizu token values — these match the :root declarations
 * in @aspect/tokens dist/css/variables.css.
 */
export const defaultStyles: ThemeStyleProps = {
  // Action
  'action-primary-default': '#2563eb', // blue-600
  'action-primary-hover': '#1d4ed8', // blue-700
  'action-primary-active': '#1e40af', // blue-800
  'action-primary-disabled': '#cbd5e1', // slate-300
  'action-destructive-default': '#dc2626', // red-600
  'action-destructive-hover': '#b91c1c', // red-700
  'action-destructive-active': '#991b1b', // red-800
  'action-destructive-disabled': '#cbd5e1', // slate-300

  // Feedback
  'feedback-success-default': '#059669', // emerald-600
  'feedback-success-subtle': '#ecfdf5', // emerald-50
  'feedback-warning-default': '#f59e0b', // amber-500
  'feedback-warning-subtle': '#fffbeb', // amber-50
  'feedback-danger-default': '#dc2626', // red-600
  'feedback-danger-subtle': '#fef2f2', // red-50

  // Surface
  'surface-default': '#ffffff',
  'surface-secondary': '#f8fafc', // slate-50
  'surface-inverse': '#0f172a', // slate-900

  // Text
  'text-primary': '#0f172a', // slate-900
  'text-secondary': '#475569', // slate-600
  'text-inverse': '#ffffff',
  'text-disabled': '#94a3b8', // slate-400

  // Border
  'border-default': '#e2e8f0', // slate-200
  'border-strong': '#94a3b8', // slate-400

  // Radius
  'radius-sm': '0.25rem',
  'radius-md': '0.375rem',
  'radius-lg': '0.5rem',
  'radius-xl': '0.75rem',

  // Shadows
  'shadow-sm': '0 1px 2px 0 rgba(0,0,0,0.05)',
  'shadow-md': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  'shadow-lg': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
  'shadow-xl': '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',

  // Typography
  'font-family-sans': "'Inter', system-ui, -apple-system, sans-serif",
  'font-family-mono': "'JetBrains Mono', 'Fira Code', monospace",

  // Motion
  'duration-fast': '150ms',
  'duration-normal': '250ms',
  'easing-out': 'cubic-bezier(0, 0, 0.2, 1)',
};

export const COMMON_STYLES = Object.keys(defaultStyles);

export const defaultThemeState: ThemeEditorState = {
  styles: defaultStyles,
  currentMode: 'light',
};
