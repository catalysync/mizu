import {
  AppBreadcrumbs,
  AppContentHeader,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Inline,
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Patterns/Detail Page',
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ResourceDetail: Story = {
  render: () => (
    <Stack gap="1.5rem">
      <AppBreadcrumbs items={[{ label: 'Apps', href: '#' }, { label: 'frosty-mountain-1234' }]} />
      <AppContentHeader
        title="frosty-mountain-1234"
        description="Next.js 16 · us-east"
        actions={
          <Inline gap="0.5rem">
            <Badge tone="success" dot>
              Running
            </Badge>
            <Button size="sm" variant="secondary">
              Restart
            </Button>
            <Button size="sm" variant="destructive">
              Delete
            </Button>
          </Inline>
        }
      />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deploys">Deploys</TabsTrigger>
          <TabsTrigger value="env">Environment</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Stack gap="1rem">
            <Card>
              <CardHeader title="Details" />
              <CardBody>
                <dl className="mizu-kv-pairs">
                  <dt>URL</dt>
                  <dd>frosty-mountain-1234.aspect.run</dd>
                  <dt>Framework</dt>
                  <dd>Next.js 16</dd>
                  <dt>Region</dt>
                  <dd>us-east</dd>
                  <dt>Last deploy</dt>
                  <dd>2 hours ago by alex</dd>
                  <dt>Created</dt>
                  <dd>March 1, 2026</dd>
                </dl>
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Add-ons" />
              <CardBody>
                <Inline gap="0.5rem">
                  <Badge tone="neutral">Postgres</Badge>
                  <Badge tone="neutral">Redis</Badge>
                </Inline>
              </CardBody>
            </Card>
          </Stack>
        </TabsContent>
        <TabsContent value="deploys">Deploy history here.</TabsContent>
        <TabsContent value="env">Environment variables here.</TabsContent>
        <TabsContent value="settings">App settings here.</TabsContent>
      </Tabs>
    </Stack>
  ),
};
