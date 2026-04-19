import React from 'react';
import type { Decorator } from '@storybook/react-vite';

/**
 * Applies the `density` toolbar global to the document root via
 * `data-mizu-density`. The density CSS layer (packages/css/src/density.css)
 * swaps spacing scales based on this attribute.
 */
export const withDensity: Decorator = (Story, context) => {
  const density =
    (context.parameters.density as string | undefined) ??
    (context.globals.density as string) ??
    'default';
  if (typeof document !== 'undefined') {
    if (density && density !== 'default') {
      document.documentElement.dataset.mizuDensity = density;
    } else {
      delete document.documentElement.dataset.mizuDensity;
    }
  }
  return React.createElement(Story);
};
