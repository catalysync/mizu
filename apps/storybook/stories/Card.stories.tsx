import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardHeader, CardBody, CardFooter, Button } from '@aspect/react';

const meta = {
  title: 'Components/Atoms/Card',
  component: Card,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card style={{ width: '20rem' }}>
      <CardHeader title="Card title" description="A short description of the card." />
      <CardBody>
        <p style={{ margin: 0 }}>Body content goes here.</p>
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
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card interactive style={{ width: '20rem' }}>
      <CardHeader title="Clickable card" description="Hover to see the interactive state." />
      <CardBody>
        <p style={{ margin: 0 }}>Click anywhere on this card.</p>
      </CardBody>
    </Card>
  ),
};
