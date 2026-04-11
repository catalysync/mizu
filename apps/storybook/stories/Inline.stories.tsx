import type { Meta, StoryObj } from '@storybook/react-vite';
import { Inline, Button, Badge } from '@aspect/react';

const meta = {
  title: 'Layouts/Inline',
  component: Inline,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Inline gap="0.5rem">
      <Button>Save</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="ghost">More</Button>
    </Inline>
  ),
};

export const AlignCenter: Story = {
  render: () => (
    <Inline gap="0.5rem" align="center">
      <span className="mizu-body--sm">Status:</span>
      <Badge>Active</Badge>
      <Badge variant="secondary">3 updates</Badge>
    </Inline>
  ),
};

export const NoWrap: Story = {
  render: () => (
    <div style={{ width: 240, overflow: 'hidden' }}>
      <Inline gap="0.5rem" wrap={false}>
        {Array.from({ length: 8 }, (_, i) => (
          <Badge key={i}>Tag {i + 1}</Badge>
        ))}
      </Inline>
    </div>
  ),
};

export const Wrap: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <Inline gap="0.5rem">
        {Array.from({ length: 8 }, (_, i) => (
          <Badge key={i}>Tag {i + 1}</Badge>
        ))}
      </Inline>
    </div>
  ),
};
