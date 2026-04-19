import React from 'react';
import type { Decorator } from '@storybook/react-vite';

/**
 * Paints document.body with a distinct canvas color for contrast testing.
 * Runs after `withMizuTheme` so it can override the theme's body paint
 * when a non-default contrast is selected; returns control to theme when
 * `default` is chosen (clears the inline style).
 */
export const withCanvasContrast: Decorator = (Story, context) => {
  const contrast = (context.globals.canvasContrast as string) ?? 'default';
  if (typeof document !== 'undefined') {
    const values: Record<string, string | null> = {
      default: null,
      subtle: '#f5f5f5',
      painted: 'var(--mizu-brand-subtle, #eef4ff)',
      hard: '#000000',
    };
    const override = values[contrast];
    if (override === null) {
      // Defer to withMizuTheme's body paint — clear any previous override.
      if (document.body.style.backgroundColor.startsWith('#')) {
        document.body.style.backgroundColor = '';
      }
    } else {
      document.body.style.backgroundColor = override;
    }
  }
  return React.createElement(Story);
};
