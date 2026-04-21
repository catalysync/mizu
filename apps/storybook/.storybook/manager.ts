import { addons } from 'storybook/manager-api';
import { mizuStorybookTheme } from './mizu-storybook-theme';

// Native Storybook tagBadges API. Renders in sidebar + toolbar when a story's
// meta includes one of these tags. See CLAUDE.md §status tags for the rule.
addons.setConfig({
  theme: mizuStorybookTheme,
  sidebar: {
    showRoots: true,
    filters: {
      // Hide internal-tagged stories from public Chromatic / Vercel builds.
      internal: (item) => !process.env.STORYBOOK_PUBLIC_BUILD || !item.tags?.includes('internal'),
    },
  },
  tagBadges: [
    {
      tags: 'stable',
      badge: {
        text: '✓',
        tooltip: 'Stable — production-ready; paired a11y stories + tests + axe passing',
        bgColor: '#d1fae5',
        fgColor: '#047857',
        borderColor: 'transparent',
      },
      // Stable stories don't need a sidebar badge; toolbar confirmation is enough.
      display: { sidebar: false, toolbar: true },
    },
    {
      tags: 'experimental',
      badge: {
        text: 'β',
        tooltip: 'Experimental — API may change; not for production',
        bgColor: '#fef3c7',
        fgColor: '#b45309',
        borderColor: 'transparent',
      },
      display: { sidebar: ['component', 'docs', 'group'], toolbar: true },
    },
    {
      tags: 'deprecated',
      badge: {
        text: '!',
        tooltip: 'Deprecated — scheduled for removal; migrate away',
        bgColor: '#fee2e2',
        fgColor: '#b91c1c',
        borderColor: 'transparent',
      },
      display: { sidebar: ['component', 'docs', 'group'], toolbar: true },
    },
    {
      tags: 'internal',
      badge: {
        text: '🔒',
        tooltip: 'Internal — not part of the public API',
        bgColor: 'transparent',
        fgColor: '#475569',
        borderColor: 'transparent',
      },
      display: { sidebar: ['component', 'docs', 'group'], toolbar: true },
    },
  ],
});
