import { VerticalBarChart } from '@aspect/charts';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { channelBreakdown } from './_fixtures';

const meta = {
  title: 'Charts/VerticalBarChart',
  component: VerticalBarChart,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof VerticalBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <VerticalBarChart
        aria-label="Sessions by channel"
        dataConfig={{ sessions: { label: 'Sessions' } }}
        data={channelBreakdown}
        yAxis={{ width: 80 }}
      />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <VerticalBarChart aria-label="Sessions loading" dataConfig={{}} data={[]} loading />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <VerticalBarChart
        aria-label="Sessions (no data)"
        dataConfig={{ sessions: { label: 'Sessions' } }}
        data={[]}
      />
    </div>
  ),
};
