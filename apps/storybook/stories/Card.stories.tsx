import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Inline,
  Stack,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Atoms/Card',
  tags: ['autodocs', 'experimental'],
  component: Card,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="story-md">
      <CardHeader title="Card title" description="A short description of the card." />
      <CardBody>
        <p className="mizu-body--sm">Body content goes here.</p>
      </CardBody>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="story-md">
      <CardHeader title="Confirm action" description="This cannot be undone." />
      <CardBody>
        <p className="mizu-body--sm">Are you sure you want to proceed?</p>
      </CardBody>
      <CardFooter>
        <Button size="sm" variant="ghost">
          Cancel
        </Button>
        <Button size="sm" variant="primary">
          Confirm
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card interactive className="story-md">
      <CardHeader title="Clickable card" description="Hover to see the effect." />
      <CardBody>
        <p className="mizu-body--sm">Click anywhere on this card.</p>
      </CardBody>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="story-md">
      <CardHeader title="Header only" description="No body or footer." />
    </Card>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Card className="story-md">
      <CardHeader>
        <Inline align="center" gap="0.5rem">
          <h3 className="mizu-card__title">Deploy status</h3>
          <Badge tone="success" dot>
            Running
          </Badge>
        </Inline>
        <p className="mizu-card__description">frosty-mountain-1234</p>
      </CardHeader>
      <CardBody>
        <dl className="mizu-kv-pairs">
          <dt>Region</dt>
          <dd>us-east</dd>
          <dt>Last deploy</dt>
          <dd>2 hours ago</dd>
        </dl>
      </CardBody>
    </Card>
  ),
};

export const Grid: Story = {
  name: 'Card grid',
  render: () => (
    <div className="mizu-grid story-lg">
      {['Analytics', 'Billing', 'Settings'].map((t) => (
        <Card key={t} interactive>
          <CardHeader title={t} description={`Manage your ${t.toLowerCase()}.`} />
        </Card>
      ))}
    </div>
  ),
};

export const Stacked: Story = {
  render: () => (
    <Stack gap="1rem" className="story-md">
      <Card>
        <CardHeader title="First card" />
        <CardBody>
          <p className="mizu-body--sm">Stacked vertically.</p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Second card" />
        <CardBody>
          <p className="mizu-body--sm">Below the first.</p>
        </CardBody>
      </Card>
    </Stack>
  ),
};
