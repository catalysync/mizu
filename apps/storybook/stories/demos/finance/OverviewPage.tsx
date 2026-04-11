import {
  AppContentHeader,
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Grid,
  Stack,
  Inline,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@aspect/react';
import { KpiCard, DeltaIndicator, MetricTile, formatCurrency } from '@aspect/finance';
import { overviewKpis, invoices, transactions } from './data';

export function OverviewPage() {
  const openInvoices = invoices.filter((i) => i.status !== 'paid');
  const overdue = invoices.filter((i) => i.status === 'overdue');

  return (
    <Stack gap="1.5rem">
      <AppContentHeader
        title="Overview"
        description="April 1 — April 11, 2026"
        actions={
          <Inline gap="0.5rem">
            <Button variant="ghost">Export</Button>
            <Button variant="primary">New invoice</Button>
          </Inline>
        }
      />

      <Grid gap="1rem" min="14rem">
        <KpiCard
          label="Monthly recurring revenue"
          value={formatCurrency(overviewKpis.mrr)}
          footer={<DeltaIndicator value={overviewKpis.deltas.mrr} />}
        />
        <KpiCard
          label="Outstanding AR"
          value={formatCurrency(overviewKpis.outstandingAr)}
          footer={<DeltaIndicator value={overviewKpis.deltas.outstandingAr} />}
        />
        <KpiCard
          label="Cash in bank"
          value={formatCurrency(overviewKpis.cashInBank)}
          footer={<DeltaIndicator value={overviewKpis.deltas.cashInBank} />}
        />
        <KpiCard
          label="Net profit (April)"
          value={formatCurrency(overviewKpis.netProfitMonth)}
          footer={<DeltaIndicator value={overviewKpis.deltas.netProfitMonth} />}
        />
      </Grid>

      <Grid gap="1rem" columns="minmax(0, 2fr) minmax(0, 1fr)">
        <Card>
          <CardHeader
            title="Invoice activity"
            actions={
              <Button variant="ghost" size="sm">
                View all
              </Button>
            }
          />
          <CardBody>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Number</TableHeader>
                  <TableHeader>Customer</TableHeader>
                  <TableHeader>Due</TableHeader>
                  <TableHeader style={{ textAlign: 'end' }}>Balance</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {openInvoices.slice(0, 5).map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.number}</TableCell>
                    <TableCell>{inv.customerName}</TableCell>
                    <TableCell>{inv.dueOn}</TableCell>
                    <TableCell style={{ textAlign: 'end', fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrency(inv.balance)}
                    </TableCell>
                    <TableCell>
                      <Badge tone={statusTone(inv.status)}>{inv.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        <Stack gap="1rem">
          <MetricTile
            label="Invoices due"
            value={String(openInvoices.length)}
            footer={`${overdue.length} overdue`}
          />
          <MetricTile label="Largest customer" value="Tidewater" footer={formatCurrency(18700)} />
          <MetricTile
            label="This month expenses"
            value={formatCurrency(18936)}
            footer="−4% vs March"
          />
          <MetricTile label="Net margin" value="64%" footer="+2 pts vs March" />
        </Stack>
      </Grid>

      <Card>
        <CardHeader title="Aged receivables" />
        <CardBody>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Current</TableHeader>
                <TableHeader>1–30</TableHeader>
                <TableHeader>31–60</TableHeader>
                <TableHeader>61–90</TableHeader>
                <TableHeader>90+</TableHeader>
                <TableHeader style={{ textAlign: 'end' }}>Total</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{formatCurrency(9600)}</TableCell>
                <TableCell>{formatCurrency(8670)}</TableCell>
                <TableCell>{formatCurrency(4320)}</TableCell>
                <TableCell>{formatCurrency(1230)}</TableCell>
                <TableCell>{formatCurrency(800)}</TableCell>
                <TableCell style={{ textAlign: 'end', fontWeight: 600 }}>
                  {formatCurrency(overviewKpis.outstandingAr)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Recent transactions" />
        <CardBody>
          <Stack gap="0.5rem">
            {transactions.slice(0, 5).map((t) => (
              <Inline
                key={t.id}
                gap="1rem"
                align="center"
                style={{ justifyContent: 'space-between' }}
              >
                <Stack gap="0.125rem">
                  <strong>{t.description}</strong>
                  <span style={{ color: 'var(--mizu-text-secondary)', fontSize: '0.75rem' }}>
                    {t.date} · {t.category}
                  </span>
                </Stack>
                <span
                  style={{
                    fontVariantNumeric: 'tabular-nums',
                    color:
                      t.credit > 0
                        ? 'var(--mizu-feedback-success-default)'
                        : 'var(--mizu-text-primary)',
                    fontWeight: 500,
                  }}
                >
                  {t.credit > 0 ? `+${formatCurrency(t.credit)}` : `−${formatCurrency(t.debit)}`}
                </span>
              </Inline>
            ))}
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}

function statusTone(status: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'paid') return 'success';
  if (status === 'overdue') return 'danger';
  if (status === 'sent') return 'warning';
  return 'neutral';
}
