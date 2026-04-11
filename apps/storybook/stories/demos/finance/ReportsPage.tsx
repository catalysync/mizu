import { useState } from 'react';
import {
  AppContentHeader,
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Inline,
  Stack,
  cn,
} from '@aspect/react';
import { formatCurrency } from '@aspect/finance';
import { reports, type ReportTile } from './data';

export function ReportsPage() {
  const [active, setActive] = useState<ReportTile | null>(null);

  return (
    <Stack gap="1.5rem">
      <AppContentHeader
        title="Reports"
        description="Canonical templates for the metrics you need most."
        actions={<Button variant="primary">Custom report</Button>}
      />

      <Grid gap="1rem" min="16rem">
        {reports.map((r) => (
          <Card key={r.id}>
            <CardBody>
              <Stack gap="0.75rem">
                <Stack gap="0.25rem">
                  <strong>{r.title}</strong>
                  <span className="finance-demo__muted-sm">{r.description}</span>
                </Stack>
                <Sparkline data={r.sparkline} />
                <Inline gap="0.5rem">
                  <Button variant="primary" size="sm" onClick={() => setActive(r)}>
                    Run report
                  </Button>
                  <Button variant="ghost" size="sm">
                    Preview
                  </Button>
                </Inline>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {active && <ReportViewer report={active} onClose={() => setActive(null)} />}
    </Stack>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const width = 260;
  const height = 48;
  const step = width / Math.max(1, data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-label="Trend sparkline"
      className="finance-demo__sparkline"
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--mizu-action-primary-default)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReportViewer({ report, onClose }: { report: ReportTile; onClose: () => void }) {
  return (
    <Card>
      <CardHeader
        title={report.title}
        actions={
          <Inline gap="0.5rem">
            <Button variant="ghost" size="sm">
              Export CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </Inline>
        }
      />
      <CardBody>
        <p className="finance-demo__section-desc">{report.description}. Showing April 2026.</p>
        <table className="finance-demo__report-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>This month</th>
              <th>Last month</th>
              <th>Delta</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Revenue', 84200, 76000],
              ['Cost of goods sold', -18400, -16000],
              ['Gross profit', 65800, 60000],
              ['Operating expenses', -43210, -41200],
              ['Net profit', 22590, 18800],
            ].map(([label, now, prev]) => {
              const n = now as number;
              const p = prev as number;
              const delta = n - p;
              return (
                <tr key={label as string}>
                  <td>{label}</td>
                  <td>{formatCurrency(n)}</td>
                  <td className="finance-demo__report-prev">{formatCurrency(p)}</td>
                  <td
                    className={cn(
                      delta >= 0
                        ? 'finance-demo__report-delta--up'
                        : 'finance-demo__report-delta--down',
                    )}
                  >
                    {delta >= 0 ? '+' : ''}
                    {formatCurrency(delta)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
