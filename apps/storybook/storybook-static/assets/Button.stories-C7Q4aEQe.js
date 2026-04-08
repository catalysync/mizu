import { B as d, j as e } from './index-BFPO4EC0.js';
import './iframe-BQjLC8sM.js';
import './preload-helper-PPVm8Dsz.js';
const h = {
    title: 'Components/Button',
    component: d,
    parameters: { layout: 'centered' },
    argTypes: {
      variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'destructive'] },
      size: { control: 'select', options: ['sm', 'md', 'lg', 'icon'] },
      disabled: { control: 'boolean' },
    },
    args: { children: 'Button', variant: 'primary', size: 'md' },
  },
  s = {},
  a = { args: { variant: 'secondary' } },
  t = { args: { variant: 'ghost' } },
  o = { args: { variant: 'destructive' } },
  n = {
    render: (m) =>
      e.jsxs('div', {
        style: { display: 'flex', gap: '1rem', alignItems: 'center' },
        children: [
          e.jsx(d, { ...m, size: 'sm', children: 'Small' }),
          e.jsx(d, { ...m, size: 'md', children: 'Medium' }),
          e.jsx(d, { ...m, size: 'lg', children: 'Large' }),
        ],
      }),
  },
  i = { args: { disabled: !0 } },
  c = { args: { loading: !0, children: 'Saving' } },
  r = {
    name: 'Icon — Inaccessible (intentional)',
    args: {
      size: 'icon',
      children: e.jsx('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        width: '16',
        height: '16',
        children: e.jsx('path', { d: 'M5 12h14M12 5l7 7-7 7' }),
      }),
    },
  },
  l = {
    name: 'Icon — Accessible',
    args: {
      size: 'icon',
      'aria-label': 'Continue',
      children: e.jsx('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        width: '16',
        height: '16',
        children: e.jsx('path', { d: 'M5 12h14M12 5l7 7-7 7' }),
      }),
    },
  };
s.parameters = {
  ...s.parameters,
  docs: { ...s.parameters?.docs, source: { originalSource: '{}', ...s.parameters?.docs?.source } },
};
a.parameters = {
  ...a.parameters,
  docs: {
    ...a.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    variant: 'secondary'
  }
}`,
      ...a.parameters?.docs?.source,
    },
  },
};
t.parameters = {
  ...t.parameters,
  docs: {
    ...t.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    variant: 'ghost'
  }
}`,
      ...t.parameters?.docs?.source,
    },
  },
};
o.parameters = {
  ...o.parameters,
  docs: {
    ...o.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    variant: 'destructive'
  }
}`,
      ...o.parameters?.docs?.source,
    },
  },
};
n.parameters = {
  ...n.parameters,
  docs: {
    ...n.parameters?.docs,
    source: {
      originalSource: `{
  render: args => <div style={{
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
}`,
      ...n.parameters?.docs?.source,
    },
  },
};
i.parameters = {
  ...i.parameters,
  docs: {
    ...i.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    disabled: true
  }
}`,
      ...i.parameters?.docs?.source,
    },
  },
};
c.parameters = {
  ...c.parameters,
  docs: {
    ...c.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    loading: true,
    children: 'Saving'
  }
}`,
      ...c.parameters?.docs?.source,
    },
  },
};
r.parameters = {
  ...r.parameters,
  docs: {
    ...r.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Icon — Inaccessible (intentional)',
  args: {
    size: 'icon',
    children: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
  }
}`,
      ...r.parameters?.docs?.source,
    },
    description: {
      story: `Deliberately broken: an icon-only button with no accessible label.
The a11y addon panel should flag this story; vitest-axe also catches it.`,
      ...r.parameters?.docs?.description,
    },
  },
};
l.parameters = {
  ...l.parameters,
  docs: {
    ...l.parameters?.docs,
    source: {
      originalSource: `{
  name: 'Icon — Accessible',
  args: {
    size: 'icon',
    'aria-label': 'Continue',
    children: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
  }
}`,
      ...l.parameters?.docs?.source,
    },
  },
};
const v = [
  'Primary',
  'Secondary',
  'Ghost',
  'Destructive',
  'AllSizes',
  'Disabled',
  'Loading',
  'Inaccessible',
  'Accessible',
];
export {
  l as Accessible,
  n as AllSizes,
  o as Destructive,
  i as Disabled,
  t as Ghost,
  r as Inaccessible,
  c as Loading,
  s as Primary,
  a as Secondary,
  v as __namedExportsOrder,
  h as default,
};
