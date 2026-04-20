import { ComboChart } from '@aspect/charts';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { formatUsd, monthlyRevenue } from './_fixtures';

const meta = {
  title: 'Charts/ComboChart',
  component: ComboChart,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ComboChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BarsPlusLine: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <ComboChart
        aria-label="Revenue bars with cost trendline"
        dataConfig={{ revenue: { label: 'Revenue' }, cost: { label: 'Cost' } }}
        data={monthlyRevenue}
        bars={['revenue']}
        xAxis={{}}
        yAxis={{ hide: false, tickFormatter: formatUsd }}
      />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <ComboChart aria-label="Combo loading" dataConfig={{}} data={[]} bars={[]} loading />
    </div>
  ),
};
