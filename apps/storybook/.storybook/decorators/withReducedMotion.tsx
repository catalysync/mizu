import React from 'react';
import type { Decorator } from '@storybook/react-vite';

/**
 * Reads the `reducedMotion` toolbar global and sets `data-reduced-motion`
 * on the document root. CSS layers (motion tokens, transitions) respect
 * this attribute and disable or tone down animations when it's "on".
 */
export const withReducedMotion: Decorator = (Story, context) => {
  const reducedMotion =
    (context.parameters.reducedMotion as string | undefined) ??
    (context.globals.reducedMotion as string) ??
    'off';
  if (typeof document !== 'undefined') {
    if (reducedMotion === 'on') {
      document.documentElement.dataset.reducedMotion = 'true';
    } else {
      delete document.documentElement.dataset.reducedMotion;
    }
  }
  return React.createElement(Story);
};
