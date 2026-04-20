import { BarChart } from '@aspect/charts';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { formatUsd, monthlyRevenue } from './_fixtures';

const meta = {
  title: 'Charts/BarChart',
  component: BarChart,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSeries: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <BarChart
        aria-label="Revenue by month"
        dataConfig={{ revenue: { label: 'Revenue' } }}
        data={monthlyRevenue.map(({ label, values }) => ({
          label,
          values: { revenue: values.revenue },
        }))}
        xAxis={{}}
        yAxis={{ hide: false, tickFormatter: formatUsd }}
      />
    </div>
  ),
};

export const Stacked: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <BarChart
        aria-label="Revenue and cost stacked"
        dataConfig={{ revenue: { label: 'Revenue' }, cost: { label: 'Cost' } }}
        data={monthlyRevenue}
        stacked
        xAxis={{}}
        yAxis={{ hide: false, tickFormatter: formatUsd }}
      />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <BarChart
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
      <BarChart
        aria-label="Revenue (no data)"
        dataConfig={{ revenue: { label: 'Revenue' } }}
        data={[]}
      />
    </div>
  ),
};
