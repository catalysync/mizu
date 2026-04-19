import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator, Stack, Inline } from '@aspect/react';

const meta = {
  title: 'Components/Atoms/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <Stack gap="1rem" className="story-md">
      <p className="mizu-body">Above the separator</p>
      <Separator />
      <p className="mizu-body">Below the separator</p>
    </Stack>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Inline gap="1rem" align="center" style={{ height: '2rem' }}>
      <span className="mizu-body">Left</span>
      <Separator orientation="vertical" />
      <span className="mizu-body">Middle</span>
      <Separator orientation="vertical" />
      <span className="mizu-body">Right</span>
    </Inline>
  ),
};
