import { PieChart } from '@aspect/charts';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { productShare } from './_fixtures';

const meta = {
  title: 'Charts/PieChart',
  component: PieChart,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Donut: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <PieChart aria-label="Revenue by product line" data={productShare} />
    </div>
  ),
};

export const FullPie: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <PieChart aria-label="Revenue by product line" data={productShare} innerRadius={0} />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <PieChart aria-label="Loading revenue share" data={[]} loading />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <PieChart aria-label="Revenue share (no data)" data={[]} />
    </div>
  ),
};
