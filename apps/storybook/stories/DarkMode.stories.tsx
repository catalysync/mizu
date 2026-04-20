import { Badge, Button, Card, CardBody, CardHeader, Inline, Input, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

function DarkSample() {
  return (
    <Stack gap="1.5rem">
      <Inline gap="0.5rem" align="center">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </Inline>
      <Input placeholder="Search…" aria-label="Search" />
      <Inline gap="0.5rem">
        <Badge tone="success" dot>
          Running
        </Badge>
        <Badge tone="danger">Failed</Badge>
        <Badge tone="info">New</Badge>
        <Badge tone="neutral">Draft</Badge>
      </Inline>
      <Card>
        <CardHeader title="Dark mode card" description="All components inherit the dark theme." />
        <CardBody>
          <p className="mizu-body">This card and everything inside it uses dark token overrides.</p>
        </CardBody>
      </Card>
    </Stack>
  );
}

const meta = {
  title: 'Foundations/Dark Mode',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  render: () => (
    <div data-theme="light">
      <DarkSample />
    </div>
  ),
};

export const Dark: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div data-theme="dark" className="story-dark-wrapper">
      <DarkSample />
    </div>
  ),
};

export const DarkCompact: Story = {
  name: 'Dark + Compact',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div data-theme="dark" data-mizu-density="compact" className="story-dark-wrapper">
      <DarkSample />
    </div>
  ),
};
