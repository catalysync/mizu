import { Badge, Button, Cluster } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Layouts/Cluster',
  tags: ['autodocs', 'experimental'],
  component: Cluster,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Cluster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Cluster gap="0.5rem">
        {['design', 'systems', 'tokens', 'components', 'layouts', 'themes', 'a11y', 'css'].map(
          (tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ),
        )}
      </Cluster>
    </div>
  ),
};

export const JustifyEnd: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Cluster gap="0.5rem" justify="flex-end">
        <Button variant="ghost">Cancel</Button>
        <Button variant="secondary">Save draft</Button>
        <Button>Publish</Button>
      </Cluster>
    </div>
  ),
};

export const SpaceBetween: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Cluster gap="0.5rem" justify="space-between">
        <span className="mizu-body--sm">12 items selected</span>
        <Cluster gap="0.5rem">
          <Button variant="ghost">Clear</Button>
          <Button variant="destructive">Delete</Button>
        </Cluster>
      </Cluster>
    </div>
  ),
};
