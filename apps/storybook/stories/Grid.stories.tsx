import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, Card, CardBody } from '@aspect/react';

const meta = {
  title: 'Layouts/Grid',
  component: Grid,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ padding: '1.5rem', maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const cards = (count: number) =>
  Array.from({ length: count }, (_, i) => (
    <Card key={i}>
      <CardBody>
        <div style={{ fontWeight: 600 }}>Card {i + 1}</div>
        <div className="mizu-body--sm" style={{ color: 'var(--mizu-text-secondary)' }}>
          Auto-placed by Grid — minimum column width drives the column count.
        </div>
      </CardBody>
    </Card>
  ));

export const Default: Story = {
  render: () => (
    <Grid gap="1rem" min="220px">
      {cards(6)}
    </Grid>
  ),
};

export const LargerMin: Story = {
  render: () => (
    <Grid gap="1rem" min="320px">
      {cards(6)}
    </Grid>
  ),
};

export const TightGap: Story = {
  render: () => (
    <Grid gap="0.25rem" min="180px">
      {cards(12)}
    </Grid>
  ),
};
