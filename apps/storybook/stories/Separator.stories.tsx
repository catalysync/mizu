import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator, Stack } from '@aspect/react';

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
