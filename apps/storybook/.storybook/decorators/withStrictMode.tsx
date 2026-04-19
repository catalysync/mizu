import React from 'react';
import type { Decorator } from '@storybook/react-vite';

/**
 * Wraps the story in React.StrictMode when the `strictMode` toolbar global
 * is "on". Lets you toggle strict-mode double-render behavior per-story.
 */
export const withStrictMode: Decorator = (Story, context) => {
  const strictValue =
    (context.parameters.strictMode as string | undefined) ??
    (context.globals.strictMode as string | undefined);
  const strict = strictValue === 'on';
  const story = React.createElement(Story);
  return strict ? React.createElement(React.StrictMode, null, story) : story;
};
