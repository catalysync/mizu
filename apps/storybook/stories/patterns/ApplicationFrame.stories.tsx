import {
  AppBreadcrumbs,
  AppContent,
  AppHeader,
  AppLayout,
  AppSidebar,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Inline,
  Stack,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Patterns/ApplicationFrame',
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SidebarNav = () => (
  <nav aria-label="Primary">
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 4 }}>
      <li>
        <a
          href="/overview"
          style={{ display: 'block', padding: '8px 12px', textDecoration: 'none' }}
        >
          Overview
        </a>
      </li>
      <li>
        <a
          href="/overview"
          style={{
            display: 'block',
            padding: '8px 12px',
            textDecoration: 'none',
            background: 'var(--mizu-surface-secondary)',
            borderRadius: 6,
          }}
        >
          Customers
        </a>
      </li>
      <li>
        <a
          href="/overview"
          style={{ display: 'block', padding: '8px 12px', textDecoration: 'none' }}
        >
          Invoices
        </a>
      </li>
      <li>
        <a
          href="/overview"
          style={{ display: 'block', padding: '8px 12px', textDecoration: 'none' }}
        >
          Reports
        </a>
      </li>
    </ul>
  </nav>
);

export const Basic: Story = {
  render: () => (
    <AppLayout>
      <AppHeader>
        <Inline gap="1rem" align="center">
          <Heading level={2} size="sm">
            Mizu
          </Heading>
          <Badge tone="neutral">v0.2</Badge>
        </Inline>
        <Inline gap="0.5rem" align="center">
          <Button variant="ghost" size="sm">
            Settings
          </Button>
          <Avatar name="Sarah Chen" />
        </Inline>
      </AppHeader>
      <AppSidebar>
        <SidebarNav />
      </AppSidebar>
      <AppContent>
        <Stack gap="1.5rem">
          <AppBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Customers' }]} />
          <Heading level={1}>Customers</Heading>
          <Card>
            <CardHeader>
              <Heading level={2} size="sm">
                All customers
              </Heading>
            </CardHeader>
            <CardBody>
              <p>Your primary content lives here.</p>
            </CardBody>
          </Card>
        </Stack>
      </AppContent>
    </AppLayout>
  ),
};
