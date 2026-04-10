import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Switch,
  Stack,
  Inline,
  Separator,
} from '@aspect/react';

function SampleUI() {
  return (
    <Stack gap="1.25rem">
      <Inline gap="0.5rem" align="center">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
      </Inline>
      <Inline gap="0.5rem">
        <Badge tone="success" dot>
          Active
        </Badge>
        <Badge tone="warning">Pending</Badge>
        <Badge tone="danger">Failed</Badge>
        <Badge tone="info">New</Badge>
      </Inline>
      <Input label="Email" placeholder="you@example.com" />
      <Card>
        <CardHeader title="Project settings" description="Configure your workspace." />
        <CardBody>
          <Inline gap="0.5rem" align="center">
            <Switch id="id-switch" aria-label="Notifications" defaultChecked />
            <label htmlFor="id-switch" className="mizu-body--sm">
              Enable notifications
            </label>
          </Inline>
        </CardBody>
        <CardFooter>
          <Button size="sm" variant="ghost">
            Cancel
          </Button>
          <Button size="sm" variant="primary">
            Save
          </Button>
        </CardFooter>
      </Card>
    </Stack>
  );
}

const identities = [
  { name: 'Default (mizu)', attr: undefined },
  { name: 'Rounded', attr: 'rounded' },
  { name: 'Sharp', attr: 'sharp' },
  { name: 'Elevated', attr: 'elevated' },
  { name: 'Bold', attr: 'bold' },
  { name: 'Minimal', attr: 'minimal' },
  { name: 'Precise', attr: 'precise' },
  { name: 'Structured', attr: 'structured' },
  { name: 'Refined', attr: 'refined' },
  { name: 'Monochrome', attr: 'monochrome' },
  { name: 'Utilitarian', attr: 'utilitarian' },
  { name: 'Fluent', attr: 'fluent' },
  { name: 'Layered', attr: 'layered' },
  { name: 'Industrial', attr: 'industrial' },
  { name: 'Organic', attr: 'organic' },
  { name: 'Muted', attr: 'muted' },
  { name: 'Atlas', attr: 'atlas' },
  { name: 'Playful', attr: 'playful' },
  { name: 'Clinical', attr: 'clinical' },
  { name: 'Editorial', attr: 'editorial' },
  { name: 'Neon', attr: 'neon' },
];

const meta = {
  title: 'Foundations/Visual Identities',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIdentities: Story = {
  render: () => (
    <div className="mizu-grid" style={{ padding: '2rem', gap: '2rem' }}>
      {identities.map((id) => (
        <div
          key={id.name}
          data-mizu-identity={id.attr}
          style={{
            background: 'var(--mizu-surface-default)',
            border: '1px solid var(--mizu-border-default)',
            borderRadius: 'var(--mizu-radius-lg)',
            padding: '1.5rem',
          }}
        >
          <h3 className="mizu-h4" style={{ marginBottom: '1rem' }}>
            {id.name}
          </h3>
          <SampleUI />
        </div>
      ))}
    </div>
  ),
};

export const Rounded: Story = {
  render: () => (
    <div data-mizu-identity="rounded" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Sharp: Story = {
  render: () => (
    <div data-mizu-identity="sharp" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Elevated: Story = {
  render: () => (
    <div data-mizu-identity="elevated" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Bold: Story = {
  render: () => (
    <div data-mizu-identity="bold" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Minimal: Story = {
  render: () => (
    <div data-mizu-identity="minimal" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Precise: Story = {
  render: () => (
    <div data-mizu-identity="precise" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Structured: Story = {
  render: () => (
    <div data-mizu-identity="structured" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Refined: Story = {
  render: () => (
    <div data-mizu-identity="refined" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Monochrome: Story = {
  render: () => (
    <div data-mizu-identity="monochrome" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Utilitarian: Story = {
  render: () => (
    <div data-mizu-identity="utilitarian" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Fluent: Story = {
  render: () => (
    <div data-mizu-identity="fluent" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Layered: Story = {
  render: () => (
    <div data-mizu-identity="layered" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Industrial: Story = {
  render: () => (
    <div data-mizu-identity="industrial" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Organic: Story = {
  render: () => (
    <div data-mizu-identity="organic" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Muted: Story = {
  render: () => (
    <div data-mizu-identity="muted" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Atlas: Story = {
  render: () => (
    <div data-mizu-identity="atlas" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Playful: Story = {
  render: () => (
    <div data-mizu-identity="playful" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Clinical: Story = {
  render: () => (
    <div data-mizu-identity="clinical" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Editorial: Story = {
  render: () => (
    <div data-mizu-identity="editorial" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};

export const Neon: Story = {
  render: () => (
    <div data-mizu-identity="neon" style={{ padding: '2rem' }}>
      <SampleUI />
    </div>
  ),
};
