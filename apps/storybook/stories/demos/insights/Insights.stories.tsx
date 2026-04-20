import { AnnotationCard, DeltaIndicator, MetricTile, TransactionRow } from '@aspect/finance';
import { Badge, Card, CardBody, CardHeader, Grid, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { insights, metrics, recentTransactions, type Insight } from './data';

const SEVERITY_ICON: Record<Insight['severity'], React.ReactNode> = {
  positive: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      width="20"
      height="20"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01l-3-3" />
    </svg>
  ),
  info: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      width="20"
      height="20"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  warning: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      width="20"
      height="20"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
};

function InsightsDashboard() {
  return (
    <div
      data-mizu-theme="insights"
      style={{
        background: 'var(--mizu-surface-default)',
        minHeight: '100vh',
        padding: 'var(--mizu-spacing-8)',
        color: 'var(--mizu-text-primary)',
      }}
    >
      <Stack gap="2rem">
        <div>
          <h1 className="mizu-h2" style={{ color: 'var(--mizu-text-primary)' }}>
            Dashboard
          </h1>
          <p className="mizu-caption">Financial overview — March 2026</p>
        </div>

        <Grid gap="1rem" min="14rem">
          {metrics.map((m) => (
            <MetricTile
              key={m.id}
              label={m.label}
              value={m.value}
              delta={<DeltaIndicator value={m.delta} />}
            />
          ))}
        </Grid>

        <Grid gap="1rem" min="20rem">
          <Card>
            <CardHeader title="AI Insights" />
            <CardBody>
              <Stack gap="0.75rem">
                {insights.map((ins) => (
                  <AnnotationCard key={ins.id} icon={SEVERITY_ICON[ins.severity]} title={ins.title}>
                    {ins.body}
                  </AnnotationCard>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Recent Transactions" />
            <CardBody>
              <Stack gap="0">
                {recentTransactions.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    date={tx.date}
                    description={tx.description}
                    amount={tx.amount}
                    category={
                      <Badge tone={tx.amount > 0 ? 'success' : 'neutral'}>{tx.category}</Badge>
                    }
                  />
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>
    </div>
  );
}

const meta = {
  title: 'Demos/Insights',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  render: () => <InsightsDashboard />,
};

function TransactionsPage() {
  return (
    <div
      data-mizu-theme="insights"
      style={{
        background: 'var(--mizu-surface-default)',
        minHeight: '100vh',
        padding: 'var(--mizu-spacing-8)',
        color: 'var(--mizu-text-primary)',
      }}
    >
      <Stack gap="1.5rem">
        <div>
          <h1 className="mizu-h2" style={{ color: 'var(--mizu-text-primary)' }}>
            Transactions
          </h1>
          <p className="mizu-caption">All financial transactions — March 2026</p>
        </div>

        <Grid gap="1rem" min="14rem">
          <MetricTile label="Inflows" value="$47.1K" delta={<DeltaIndicator value={0.15} />} />
          <MetricTile label="Outflows" value="$56.8K" delta={<DeltaIndicator value={0.04} />} />
          <MetricTile label="Net" value="-$9.7K" delta={<DeltaIndicator value={-0.32} />} />
        </Grid>

        <Card>
          <CardHeader title="All Transactions" />
          <CardBody>
            <Stack gap="0">
              {recentTransactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  date={tx.date}
                  description={tx.description}
                  amount={tx.amount}
                  category={
                    <Badge tone={tx.amount > 0 ? 'success' : 'neutral'}>{tx.category}</Badge>
                  }
                />
              ))}
            </Stack>
          </CardBody>
        </Card>
      </Stack>
    </div>
  );
}

export const Transactions: Story = {
  render: () => <TransactionsPage />,
};
