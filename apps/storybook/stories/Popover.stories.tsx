import { Button, Input, Popover, PopoverContent, PopoverTrigger, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

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

export const NoArrow: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Details</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Stack gap="0.5rem">
          <span className="mizu-body--sm">
            A minimal popover without the pointer arrow — useful when the trigger context makes the
            relationship obvious.
          </span>
        </Stack>
      </PopoverContent>
    </Popover>
  ),
};

export const SideTop: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Opens above</Button>
      </PopoverTrigger>
      <PopoverContent side="top" showArrow>
        <span className="mizu-body--sm">I open above the trigger.</span>
      </PopoverContent>
    </Popover>
  ),
};
