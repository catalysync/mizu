import { Button, Inline, SectionHeader } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Patterns/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { title: 'Billing' },
};

export const WithDescription: Story = {
  args: {
    title: 'Billing',
    description: 'Manage payment methods, invoices, and billing history.',
  },
};

export const WithActions: Story = {
  args: {
    title: 'Team members',
    description: 'Invite collaborators to your workspace.',
    actions: (
      <Inline gap="0.5rem">
        <Button variant="ghost">Export</Button>
        <Button variant="primary">Invite</Button>
      </Inline>
    ),
  },
};

export const Nested: Story = {
  name: 'Inside another section (level=3)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <SectionHeader title="Billing" level={2} description="Top-level section." />
      <SectionHeader
        title="Payment methods"
        level={3}
        description="Subsection nested below a level=2 header."
        actions={<Button variant="primary">Add method</Button>}
      />
    </div>
  ),
};
