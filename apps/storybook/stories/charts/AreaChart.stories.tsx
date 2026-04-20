import { AreaChart } from '@aspect/charts';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { formatUsd, monthlyRevenue } from './_fixtures';

const meta = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSeries: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <AreaChart
        aria-label="Revenue area chart"
        dataConfig={{ revenue: { label: 'Revenue' } }}
        data={monthlyRevenue.map(({ label, values }) => ({
          label,
          values: { revenue: values.revenue },
        }))}
        xAxis={{}}
        yAxis={{ tickFormatter: formatUsd }}
      />
    </div>
  ),
};

export const MultiSeries: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <AreaChart
        aria-label="Revenue and cost area chart"
        dataConfig={{ revenue: { label: 'Revenue' }, cost: { label: 'Cost' } }}
        data={monthlyRevenue}
        xAxis={{}}
        yAxis={{ tickFormatter: formatUsd }}
      />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <AreaChart aria-label="Area loading" dataConfig={{}} data={[]} loading />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <AreaChart
        aria-label="Area (no data)"
        dataConfig={{ revenue: { label: 'Revenue' } }}
        data={[]}
      />
    </div>
  ),
};
