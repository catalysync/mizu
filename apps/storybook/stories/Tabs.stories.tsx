import { Badge, Inline, Tabs, TabsContent, TabsList, TabsTrigger } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview content.</TabsContent>
      <TabsContent value="resources">Resources content.</TabsContent>
      <TabsContent value="activity">Activity content.</TabsContent>
      <TabsContent value="settings">Settings content.</TabsContent>
    </Tabs>
  ),
};

export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="code">
      <TabsList>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="code">
        <pre className="mizu-mono">{'const x = 42;'}</pre>
      </TabsContent>
      <TabsContent value="preview">
        <p className="mizu-body--sm">Rendered output.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <Tabs defaultValue="open">
      <TabsList>
        <TabsTrigger value="open">
          <Inline gap="0.375rem" align="center">
            Open <Badge tone="info">3</Badge>
          </Inline>
        </TabsTrigger>
        <TabsTrigger value="resolved">
          <Inline gap="0.375rem" align="center">
            Resolved <Badge tone="neutral">12</Badge>
          </Inline>
        </TabsTrigger>
        <TabsTrigger value="snoozed">Snoozed</TabsTrigger>
      </TabsList>
      <TabsContent value="open">3 open conversations.</TabsContent>
      <TabsContent value="resolved">12 resolved.</TabsContent>
      <TabsContent value="snoozed">None snoozed.</TabsContent>
    </Tabs>
  ),
};

export const WithContent: Story = {
  render: () => (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
        <TabsTrigger value="env">Environment</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <dl className="mizu-kv-pairs">
          <dt>App</dt>
          <dd>frosty-mountain-1234</dd>
          <dt>Framework</dt>
          <dd>Next.js 16</dd>
          <dt>Status</dt>
          <dd>
            <Badge tone="success" dot>
              Running
            </Badge>
          </dd>
        </dl>
      </TabsContent>
      <TabsContent value="logs">
        <pre className="mizu-mono">
          {'2026-03-28 10:42:00 Deploy started\n2026-03-28 10:42:48 Deploy complete'}
        </pre>
      </TabsContent>
      <TabsContent value="env">
        <p className="mizu-body--sm">3 environment variables.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="t1">
      <TabsList>
        {Array.from({ length: 8 }, (_, i) => (
          <TabsTrigger key={i} value={`t${i + 1}`}>
            Tab {i + 1}
          </TabsTrigger>
        ))}
      </TabsList>
      {Array.from({ length: 8 }, (_, i) => (
        <TabsContent key={i} value={`t${i + 1}`}>
          Content {i + 1}.
        </TabsContent>
      ))}
    </Tabs>
  ),
};

export const SecondSelected: Story = {
  render: () => (
    <Tabs defaultValue="second">
      <TabsList>
        <TabsTrigger value="first">First</TabsTrigger>
        <TabsTrigger value="second">Second</TabsTrigger>
        <TabsTrigger value="third">Third</TabsTrigger>
      </TabsList>
      <TabsContent value="first">First.</TabsContent>
      <TabsContent value="second">Second tab selected by default.</TabsContent>
      <TabsContent value="third">Third.</TabsContent>
    </Tabs>
  ),
};
