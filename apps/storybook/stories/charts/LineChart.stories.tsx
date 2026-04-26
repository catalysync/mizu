import { LineChart } from '@aspect/charts';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { formatUsd, monthlyRevenue } from './_fixtures';

const meta = {
  title: 'Charts/LineChart',
  tags: ['autodocs', 'experimental'],
  component: LineChart,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSeries: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <LineChart
        aria-label="Monthly revenue"
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
      <LineChart
        aria-label="Revenue and cost by month"
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
      <LineChart
        aria-label="Revenue loading"
        dataConfig={{}}
        data={[]}
        loading
        loadingLabel="Loading revenue chart"
      />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <LineChart
        aria-label="Revenue (no data)"
        dataConfig={{ revenue: { label: 'Revenue' } }}
        data={[]}
      />
    </div>
  ),
};
