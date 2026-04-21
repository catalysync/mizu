import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  DateNavigator,
  type DateNavigatorValue,
  Inline,
  Input,
  PageHeader,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Patterns/PageHeader',
  component: PageHeader,
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { title: 'Customers' },
};

export const WithDescription: Story = {
  args: {
    title: 'Customers',
    description:
      'All active and archived customers. Filter by status or use search to narrow down.',
  },
};

export const WithBreadcrumbsAndActions: Story = {
  args: {
    title: 'Customers',
    description: 'All customers across all workspaces.',
    breadcrumbs: (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Customers</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    actions: (
      <Inline gap="0.5rem">
        <Button variant="ghost">Export</Button>
        <Button variant="primary">Invite</Button>
      </Inline>
    ),
  },
};

export const WithToolbar: Story = {
  name: 'Full example — breadcrumbs + actions + toolbar row',
  render: () => {
    const [range, setRange] = useState<DateNavigatorValue>({
      start: new Date(2026, 3, 15),
      end: new Date(2026, 3, 21),
      preset: 'last-7',
    });
    return (
      <PageHeader
        title="Reports"
        description="Explore revenue, cost, and margin across the selected time range."
        breadcrumbs={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Reports</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        actions={
          <Inline gap="0.5rem">
            <Button variant="ghost">Export CSV</Button>
            <Button variant="primary">Share</Button>
          </Inline>
        }
        toolbar={
          <Inline gap="1rem" align="center">
            <Input placeholder="Search reports…" style={{ width: 260 }} />
            <DateNavigator value={range} onChange={setRange} />
          </Inline>
        }
      />
    );
  },
};
