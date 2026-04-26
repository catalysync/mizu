import { Center, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Layouts/Center',
  tags: ['autodocs', 'experimental'],
  component: Center,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Center max="32rem" padding="1rem">
      <Stack gap="0.75rem">
        <h2 style={{ margin: 0 }}>Centered content</h2>
        <p className="mizu-body--sm" style={{ color: 'var(--mizu-text-secondary)' }}>
          Center clamps the width to <code>max</code> and adds horizontal padding. Useful for
          article-width text columns or centered form layouts.
        </p>
      </Stack>
    </Center>
  ),
};

export const Narrow: Story = {
  render: () => (
    <Center max="20rem" padding="1rem">
      <Stack gap="0.5rem" style={{ textAlign: 'center' }}>
        <h2 style={{ margin: 0 }}>Tight column</h2>
        <p className="mizu-body--sm" style={{ color: 'var(--mizu-text-secondary)' }}>
          A narrow 20rem max width.
        </p>
      </Stack>
    </Center>
  ),
};

export const ColumnMode: Story = {
  render: () => (
    <div style={{ minHeight: '80vh' }}>
      <Center max="20rem" padding="1rem" column>
        <Stack gap="0.5rem" style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>Both axes</h2>
          <p className="mizu-body--sm" style={{ color: 'var(--mizu-text-secondary)' }}>
            <code>column</code> also centers along the vertical axis (useful for empty-state cards
            and login forms).
          </p>
        </Stack>
      </Center>
    </div>
  ),
};
