import { Card, Grid, Inline, Stack } from '@aspect/react';
import { DeltaIndicator, MetricTile, formatCurrency } from '@aspect/finance';
import { definePattern } from '@/lib/patterns/types';
import type { OutputFile, RenderContext } from '@/lib/patterns/types';

interface Kpi {
  label: string;
  value: number;
  delta: number;
  format: 'currency' | 'integer' | 'percent';
}

const kpis: Kpi[] = [
  { label: 'MRR', value: 84_200, delta: 12.4, format: 'currency' },
  { label: 'Active customers', value: 1_342, delta: 3.8, format: 'integer' },
  { label: 'Trial conversion', value: 34.2, delta: -1.6, format: 'percent' },
  { label: 'Net revenue retention', value: 108.5, delta: 2.1, format: 'percent' },
];

function formatKpi(kpi: Kpi): string {
  if (kpi.format === 'currency') return formatCurrency(kpi.value);
  if (kpi.format === 'percent') return `${kpi.value.toFixed(1)}%`;
  return kpi.value.toLocaleString();
}

function Preview() {
  return (
    <Stack gap="1rem">
      <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
        <span className="text-sm text-muted-foreground">Last 30 days · vs previous period</span>
      </Inline>
      <Grid gap="1rem" min="14rem">
        {kpis.map((kpi) => (
          <MetricTile
            key={kpi.label}
            label={kpi.label}
            value={formatKpi(kpi)}
            delta={<DeltaIndicator value={kpi.delta} />}
          />
        ))}
      </Grid>
      <Card>
        <Stack gap="0.5rem" style={{ padding: '1rem' }}>
          <span className="mizu-heading-sm">Recent activity</span>
          <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
            Revenue, expansion, and churn events for the last 24 hours.
          </span>
        </Stack>
      </Card>
    </Stack>
  );
}

const TEMPLATE = `import { Card, Grid, Inline, Stack } from '@aspect/react';
import { DeltaIndicator, MetricTile, formatCurrency } from '@aspect/finance';

interface Kpi {
  label: string;
  value: number;
  delta: number;
  format: 'currency' | 'integer' | 'percent';
}

const kpis: Kpi[] = [
  { label: 'MRR', value: 84_200, delta: 12.4, format: 'currency' },
  { label: 'Active customers', value: 1_342, delta: 3.8, format: 'integer' },
  { label: 'Trial conversion', value: 34.2, delta: -1.6, format: 'percent' },
  { label: 'Net revenue retention', value: 108.5, delta: 2.1, format: 'percent' },
];

function formatKpi(kpi: Kpi): string {
  if (kpi.format === 'currency') return formatCurrency(kpi.value);
  if (kpi.format === 'percent') return \`\${kpi.value.toFixed(1)}%\`;
  return kpi.value.toLocaleString();
}

export default function DashboardPage() {
  return (
    <Stack gap="1rem">
      <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
        <span className="text-sm text-muted-foreground">Last 30 days · vs previous period</span>
      </Inline>
      <Grid gap="1rem" min="14rem">
        {kpis.map((kpi) => (
          <MetricTile
            key={kpi.label}
            label={kpi.label}
            value={formatKpi(kpi)}
            delta={<DeltaIndicator value={kpi.delta} />}
          />
        ))}
      </Grid>
      <Card>
        <Stack gap="0.5rem" style={{ padding: '1rem' }}>
          <span className="mizu-heading-sm">Recent activity</span>
          <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
            Revenue, expansion, and churn events for the last 24 hours.
          </span>
        </Stack>
      </Card>
    </Stack>
  );
}
`;

export const saasDashboard = definePattern({
  meta: {
    id: 'saas.dashboard',
    name: 'SaaS KPI Dashboard',
    description:
      'Top-level SaaS dashboard with MetricTile KPIs, DeltaIndicator arrows, and an activity summary card.',
    kind: 'page',
    industries: ['saas-admin', 'fintech'],
    tier: 'free',
    depends: [
      '@aspect/react#Card',
      '@aspect/react#Grid',
      '@aspect/react#Stack',
      '@aspect/react#Inline',
      '@aspect/finance#MetricTile',
      '@aspect/finance#DeltaIndicator',
      '@aspect/finance#formatCurrency',
    ],
    sources: [
      {
        system: 'stripe',
        relationship: 'ia-borrowed',
        notes: 'KPI strip + delta arrows pattern echoes Stripe dashboard overview.',
      },
      {
        system: 'linear',
        relationship: 'visual-rhythm',
        notes: 'Clean KPI tile density from Linear insights view.',
      },
      {
        system: 'vercel',
        relationship: 'inspired-by',
        notes: 'Time-range picker convention from Vercel analytics.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/dashboard/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});
