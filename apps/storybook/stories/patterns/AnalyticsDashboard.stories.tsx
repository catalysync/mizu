import { AreaChart, BarChart, LineChart, PieChart } from '@aspect/charts';
import {
  AnalyticsDashboard,
  AnalyticsDashboardTile,
  Button,
  DateNavigator,
  type DateNavigatorValue,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Patterns/AnalyticsDashboard',
  component: AnalyticsDashboard,
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AnalyticsDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

const revenueData = [
  { label: 'Jan', values: { revenue: 12400 } },
  { label: 'Feb', values: { revenue: 13800 } },
  { label: 'Mar', values: { revenue: 15200 } },
  { label: 'Apr', values: { revenue: 14600 } },
  { label: 'May', values: { revenue: 17800 } },
  { label: 'Jun', values: { revenue: 19200 } },
];

const channelData = [
  { label: 'Jan', values: { organic: 240, paid: 180 } },
  { label: 'Feb', values: { organic: 280, paid: 220 } },
  { label: 'Mar', values: { organic: 320, paid: 200 } },
  { label: 'Apr', values: { organic: 360, paid: 240 } },
];

const sharePie = [
  { label: 'Core', value: 540 },
  { label: 'Growth', value: 320 },
  { label: 'Enterprise', value: 180 },
];

export const FourColumnDashboard: Story = {
  render: () => {
    const [range, setRange] = useState<DateNavigatorValue>({
      start: new Date(2026, 3, 1),
      end: new Date(2026, 3, 30),
      preset: 'this-month',
    });
    return (
      <AnalyticsDashboard
        title="Sales overview"
        description="Revenue, customer growth, and product mix."
        filters={<DateNavigator value={range} onChange={setRange} />}
        actions={<Button variant="ghost">Export</Button>}
      >
        <AnalyticsDashboardTile title="MRR" description="Monthly recurring revenue">
          <div style={{ fontSize: 32, fontWeight: 600 }}>$19.2k</div>
        </AnalyticsDashboardTile>
        <AnalyticsDashboardTile title="Active customers">
          <div style={{ fontSize: 32, fontWeight: 600 }}>1,248</div>
        </AnalyticsDashboardTile>
        <AnalyticsDashboardTile title="New this month">
          <div style={{ fontSize: 32, fontWeight: 600 }}>+84</div>
        </AnalyticsDashboardTile>
        <AnalyticsDashboardTile title="Churn rate">
          <div style={{ fontSize: 32, fontWeight: 600 }}>1.8%</div>
        </AnalyticsDashboardTile>

        <AnalyticsDashboardTile title="Revenue trend" colSpan={2}>
          <LineChart
            aria-label="Monthly revenue"
            dataConfig={{ revenue: { label: 'Revenue' } }}
            data={revenueData}
            height={220}
            xAxis={{}}
          />
        </AnalyticsDashboardTile>

        <AnalyticsDashboardTile title="Product mix" colSpan={2}>
          <PieChart
            aria-label="Product mix"
            data={sharePie}
            height={220}
            innerRadius={48}
            outerRadius={80}
          />
        </AnalyticsDashboardTile>

        <AnalyticsDashboardTile title="Channel performance" colSpan={4}>
          <AreaChart
            aria-label="Channels"
            dataConfig={{ organic: { label: 'Organic' }, paid: { label: 'Paid' } }}
            data={channelData}
            height={220}
            xAxis={{}}
          />
        </AnalyticsDashboardTile>
      </AnalyticsDashboard>
    );
  },
};

export const WithLoadingTiles: Story = {
  render: () => (
    <AnalyticsDashboard title="Loading state" columns={3}>
      <AnalyticsDashboardTile title="MRR" loading>
        <BarChart aria-label="Revenue loading" dataConfig={{}} data={[]} loading height={180} />
      </AnalyticsDashboardTile>
      <AnalyticsDashboardTile title="Customers" loading>
        <div style={{ height: 180 }} />
      </AnalyticsDashboardTile>
      <AnalyticsDashboardTile title="Churn" loading>
        <div style={{ height: 180 }} />
      </AnalyticsDashboardTile>
    </AnalyticsDashboard>
  ),
};
