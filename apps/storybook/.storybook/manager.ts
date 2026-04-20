import React from 'react';
import { addons } from 'storybook/manager-api';
import { mizuStorybookTheme } from './mizu-storybook-theme';

type Tag = 'stable' | 'experimental' | 'deprecated';

const BADGES: Record<Tag, { label: string; fg: string; bg: string; title: string }> = {
  stable: {
    label: '✓',
    fg: '#047857',
    bg: '#d1fae5',
    title: 'Stable — production-ready; paired a11y stories + tests + axe passing',
  },
  experimental: {
    label: 'β',
    fg: '#b45309',
    bg: '#fef3c7',
    title: 'Experimental — API may change; not for production',
  },
  deprecated: {
    label: '!',
    fg: '#b91c1c',
    bg: '#fee2e2',
    title: 'Deprecated — scheduled for removal; migrate away',
  },
};

const badgeStyle = (fg: string, bg: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 16,
  height: 16,
  marginLeft: 6,
  padding: '0 5px',
  fontSize: 10,
  fontWeight: 600,
  lineHeight: 1,
  borderRadius: 8,
  color: fg,
  background: bg,
});

addons.setConfig({
  theme: mizuStorybookTheme,
  sidebar: {
    showRoots: true,
    renderLabel: (item) => {
      const tags = (item as { tags?: string[] }).tags ?? [];
      const tag = (['deprecated', 'experimental', 'stable'] as const).find((t) => tags.includes(t));
      if (!tag || item.type !== 'component') return item.name;
      const b = BADGES[tag];
      return React.createElement(
        'span',
        { style: { display: 'inline-flex', alignItems: 'center' } },
        item.name,
        React.createElement(
          'span',
          { style: badgeStyle(b.fg, b.bg), title: b.title, 'aria-label': `${tag}: ${b.title}` },
          b.label,
        ),
      );
    },
  },
});
