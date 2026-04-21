import {
  AppBreadcrumbs,
  AppContent,
  AppHeader,
  AppLayout,
  AppSidebar,
  Heading,
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Patterns/NavigationPatterns',
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SidebarWithTabsAndBreadcrumbs: Story = {
  render: () => (
    <AppLayout>
      <AppHeader>
        <Heading level={2} size="sm">
          Mizu
        </Heading>
      </AppHeader>
      <AppSidebar>
        <nav aria-label="Primary">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 4 }}>
            <li>
              <a href="/overview" style={{ padding: '8px 12px', display: 'block' }}>
                Overview
              </a>
            </li>
            <li>
              <a
                href="/overview"
                style={{
                  padding: '8px 12px',
                  display: 'block',
                  background: 'var(--mizu-surface-secondary)',
                  borderRadius: 6,
                }}
              >
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </AppSidebar>
      <AppContent>
        <Stack gap="1.5rem">
          <AppBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Settings' }]} />
          <Heading level={1}>Settings</Heading>
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <p>General settings content.</p>
            </TabsContent>
            <TabsContent value="billing">
              <p>Billing settings content.</p>
            </TabsContent>
            <TabsContent value="team">
              <p>Team settings content.</p>
            </TabsContent>
            <TabsContent value="api">
              <p>API settings content.</p>
            </TabsContent>
          </Tabs>
        </Stack>
      </AppContent>
    </AppLayout>
  ),
};
