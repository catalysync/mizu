import { Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Layouts/Stack',
  tags: ['autodocs', 'experimental'],
  component: Stack,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Vertical stack layout primitive. ⚠️ For forms use the `Form` component, not `Stack as="form"` — `Stack` is generic and skips form-specific affordances (noValidate, layout slots, disabled propagation).',
      },
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const box = (label: string, i: number): React.CSSProperties => ({
  padding: '0.75rem 1rem',
  background: `color-mix(in srgb, var(--mizu-action-primary-default) ${10 + i * 10}%, transparent)`,
  borderRadius: 'var(--mizu-radius-md)',
  color: 'var(--mizu-text-primary)',
  fontFamily: 'var(--mizu-font-family-sans)',
  minWidth: 160,
});

const items = (count = 4) =>
  Array.from({ length: count }, (_, i) => (
    <div key={i} style={box(`Item ${i + 1}`, i)}>
      Item {i + 1}
    </div>
  ));

export const Default: Story = {
  render: () => <Stack gap="0.5rem">{items()}</Stack>,
};

export const LargeGap: Story = {
  render: () => <Stack gap="2rem">{items()}</Stack>,
};

export const AlignCenter: Story = {
  render: () => (
    <Stack gap="0.5rem" align="center" style={{ width: 320 }}>
      <div style={{ ...box('a', 0), minWidth: 100 }}>Short</div>
      <div style={{ ...box('b', 1), minWidth: 200 }}>Medium width</div>
      <div style={{ ...box('c', 2), minWidth: 260 }}>Wider content block</div>
    </Stack>
  ),
};

export const Nested: Story = {
  render: () => (
    <Stack gap="1rem">
      <div style={box('header', 0)}>Header</div>
      <Stack gap="0.25rem">
        <div style={box('a', 1)}>Nested a</div>
        <div style={box('b', 2)}>Nested b</div>
      </Stack>
      <div style={box('footer', 3)}>Footer</div>
    </Stack>
  ),
};
