import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState, Button, Inline } from '@aspect/react';

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

export const WithMultipleActions: Story = {
  args: {
    title: 'No templates found',
    description: 'Create a template or browse the marketplace.',
    actions: (
      <Inline gap="0.5rem">
        <Button variant="primary">Create template</Button>
        <Button variant="secondary">Browse marketplace</Button>
      </Inline>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Inbox empty',
    description: 'All conversations are resolved.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        width="48"
        height="48"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4 12 14.01l-3-3" />
      </svg>
    ),
  },
};

export const Minimal: Story = {
  args: { title: 'Nothing here', description: undefined, actions: undefined },
};

export const InCard: Story = {
  render: () => (
    <div className="mizu-card story-lg">
      <EmptyState
        title="No transactions"
        description="Transactions will appear here once you start processing payments."
        actions={
          <Button size="sm" variant="primary">
            Connect payment provider
          </Button>
        }
      />
    </div>
  ),
};

export const SearchNoResults: Story = {
  args: {
    title: 'No matches for "xyzzy"',
    description: 'Check your spelling or try a different search term.',
    actions: <Button variant="ghost">Clear search</Button>,
  },
};
