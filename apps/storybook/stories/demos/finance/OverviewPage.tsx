import { DeltaIndicator, KpiCard, MetricTile, formatCurrency } from '@aspect/finance';
import {
  AppContentHeader,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Inline,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';
import { invoices, overviewKpis, transactions } from './data';

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

      <div className="finance-demo__overview-split">
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
                  <TableHeader className="finance-demo__th-end">Balance</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {openInvoices.slice(0, 5).map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.number}</TableCell>
                    <TableCell>{inv.customerName}</TableCell>
                    <TableCell>{inv.dueOn}</TableCell>
                    <TableCell className="finance-demo__num--end">
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
      </div>

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
                <TableHeader className="finance-demo__th-end">Total</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{formatCurrency(9600)}</TableCell>
                <TableCell>{formatCurrency(8670)}</TableCell>
                <TableCell>{formatCurrency(4320)}</TableCell>
                <TableCell>{formatCurrency(1230)}</TableCell>
                <TableCell>{formatCurrency(800)}</TableCell>
                <TableCell className="finance-demo__aged-total">
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
              <Inline key={t.id} gap="1rem" align="center" className="finance-demo__between">
                <Stack gap="0.125rem">
                  <strong>{t.description}</strong>
                  <span className="finance-demo__hint">
                    {t.date} · {t.category}
                  </span>
                </Stack>
                <span
                  className={t.credit > 0 ? 'finance-demo__tx-credit' : 'finance-demo__tx-debit'}
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
