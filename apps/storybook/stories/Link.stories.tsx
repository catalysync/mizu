import { Link, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Atoms/Link',
  tags: ['autodocs', 'experimental'],
  component: Link,
  parameters: { layout: 'padded' },
  args: { href: '#', children: 'Read the documentation' },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['inline', 'subtle', 'standalone'],
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inline: Story = {
  render: () => (
    <p>
      See the <Link href="#">pricing details</Link> to compare tiers, or{' '}
      <Link href="#">contact sales</Link> for a custom plan.
    </p>
  ),
};

export const Subtle: Story = {
  args: { variant: 'subtle', children: 'Privacy policy' },
};

export const Standalone: Story = {
  args: { variant: 'standalone', children: 'View all invoices' },
};

export const External: Story = {
  args: {
    href: 'https://cloudscape.design',
    external: true,
    children: 'Cloudscape design system',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack gap="1rem">
      <Link href="#">inline link (default)</Link>
      <Link href="#" variant="subtle">
        subtle link
      </Link>
      <Link href="#" variant="standalone">
        standalone link
      </Link>
      <Link href="https://example.com" external>
        external link
      </Link>
    </Stack>
  ),
};
