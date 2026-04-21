import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  Inline,
  ResourceHeader,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Patterns/ResourceHeader',
  component: ResourceHeader,
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ResourceHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { title: 'Acme Corp' },
};

export const WithSubtitle: Story = {
  args: {
    title: 'Acme Corp',
    subtitle: 'Enterprise customer since 2019',
  },
};

export const WithStatusAndActions: Story = {
  args: {
    title: 'Acme Corp',
    subtitle: 'Enterprise customer since 2019',
    status: <Badge tone="success">Active</Badge>,
    actions: (
      <Inline gap="0.5rem">
        <Button variant="ghost">Archive</Button>
        <Button variant="primary">Edit</Button>
      </Inline>
    ),
  },
};

export const FullExample: Story = {
  args: {
    eyebrow: (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/customers">Customers</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Acme Corp</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    title: 'Acme Corp',
    subtitle: 'Enterprise customer since 2019',
    status: <Badge tone="success">Active</Badge>,
    actions: (
      <Inline gap="0.5rem">
        <Button variant="ghost">Archive</Button>
        <Button variant="primary">Edit</Button>
      </Inline>
    ),
    meta: [
      { label: 'Account ID', value: '#A-12345' },
      { label: 'Annual contract', value: '$125,000' },
      { label: 'Renewal date', value: 'Dec 31, 2026' },
      { label: 'Owner', value: 'Sarah Chen' },
    ],
  },
};

export const Inaccessible: Story = {
  name: 'Inaccessible — action buttons with icons only, no labels',
  args: {
    title: 'Acme Corp',
    actions: (
      <Inline gap="0.5rem">
        <Button variant="ghost" size="icon">
          ✏️
        </Button>
        <Button variant="primary" size="icon">
          🗑️
        </Button>
      </Inline>
    ),
  },
};

export const Accessible: Story = {
  name: 'Accessible — icon buttons labelled + status has semantic role',
  args: {
    title: 'Acme Corp',
    status: (
      <Badge tone="success" aria-label="Status: active">
        Active
      </Badge>
    ),
    actions: (
      <Inline gap="0.5rem">
        <Button variant="ghost" size="icon" aria-label="Edit customer">
          ✏️
        </Button>
        <Button variant="primary" size="icon" aria-label="Delete customer">
          🗑️
        </Button>
      </Inline>
    ),
  },
};
