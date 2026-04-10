import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState, Button } from '@aspect/react';

const meta = {
  title: 'Components/Atoms/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
  args: {
    title: 'No results found',
    description: 'Try adjusting your search or filter to find what you are looking for.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    title: 'No apps yet',
    description: 'Deploy your first app to get started.',
    actions: <Button variant="primary">Create app</Button>,
  },
};
