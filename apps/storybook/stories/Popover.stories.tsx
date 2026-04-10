import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover, PopoverTrigger, PopoverContent, Button, Stack, Input } from '@aspect/react';

const meta = {
  title: 'Components/Overlays/Popover',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Edit name</Button>
      </PopoverTrigger>
      <PopoverContent showArrow>
        <Stack gap="0.75rem">
          <span className="mizu-caption">App name</span>
          <Input defaultValue="frosty-mountain-1234" aria-label="App name" />
          <Button size="sm" variant="primary">
            Save
          </Button>
        </Stack>
      </PopoverContent>
    </Popover>
  ),
};
