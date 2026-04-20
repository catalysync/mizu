import type { Decorator } from '@storybook/react-vite';
import React from 'react';

/**
 * Applies the `theme` + `identity` toolbar globals to the story root.
 * - `data-theme` = light | dark
 * - `data-mizu-identity` = one of the identity presets (or omitted for default)
 * Also swaps document body bg/fg when dark so the canvas itself matches.
 *
 * Per-story parameters win over the toolbar global so a story can pin itself
 * to a specific theme (`parameters: { theme: 'dark', identity: 'neon' }`).
 */
export const withMizuTheme: Decorator = (Story, context) => {
  const theme =
    (context.parameters.theme as string | undefined) ??
    (context.globals.theme as string) ??
    'light';
  const identity =
    (context.parameters.identity as string | undefined) ??
    (context.globals.identity as string) ??
    'none';

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme;
    if (identity && identity !== 'none') {
      document.documentElement.dataset.mizuIdentity = identity;
    } else {
      delete document.documentElement.dataset.mizuIdentity;
    }
    document.body.style.backgroundColor = theme === 'dark' ? 'var(--mizu-surface-default)' : '';
    document.body.style.color = theme === 'dark' ? 'var(--mizu-text-primary)' : '';
  }

  return React.createElement(Story);
};
