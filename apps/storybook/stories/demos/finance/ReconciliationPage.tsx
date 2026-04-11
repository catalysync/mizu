import {
  AppContentHeader,
  Badge,
  Button,
  cn,
  Card,
  CardBody,
  Field,
  Inline,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
} from '@aspect/react';
import { ReconciliationRow, formatCurrency } from '@aspect/finance';
import { reconciliation } from './data';

export function ReconciliationPage() {
  const matched = reconciliation.filter((r) => r.status === 'matched');
  const unmatched = reconciliation.filter((r) => r.status !== 'matched');

  const bankTotal = reconciliation.reduce((s, r) => s + r.amount, 0);
  const matchedTotal = matched.reduce((s, r) => s + r.amount, 0);
  const difference = bankTotal - matchedTotal;

  return (
    <Stack gap="1.5rem">
      <AppContentHeader
        title="Reconciliation"
        description="Match bank statement entries to ledger transactions."
        actions={<Button variant="primary">Finalize</Button>}
      />

      <Card>
        <CardBody>
          <Inline gap="1rem">
            <div className="finance-demo__filter-date">
              <Field label="Account">
                <Select defaultValue="checking">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Business checking</SelectItem>
                    <SelectItem value="savings">Savings reserve</SelectItem>
                    <SelectItem value="amex">AMEX card</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="finance-demo__filter-category">
              <Field label="Period">
                <Select defaultValue="apr">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apr">April 2026</SelectItem>
                    <SelectItem value="mar">March 2026</SelectItem>
                    <SelectItem value="feb">February 2026</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </Inline>
        </CardBody>
      </Card>

      <div className="finance-demo__reconcile-split">
        <Card>
          <CardBody>
            <Stack gap="0.75rem">
              <Inline gap="0.5rem" align="center">
                <strong>Unmatched</strong>
                <Badge tone="warning">{unmatched.length}</Badge>
              </Inline>
              <div className="finance-demo__reconcile-list">
                {unmatched.map((r) => (
                  <ReconciliationRow
                    key={r.id}
                    date={r.date}
                    description={r.description}
                    amount={r.amount}
                    status={r.status}
                    match={r.match}
                  />
                ))}
              </div>
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stack gap="0.75rem">
              <Inline gap="0.5rem" align="center">
                <strong>Matched</strong>
                <Badge tone="success">{matched.length}</Badge>
              </Inline>
              <div className="finance-demo__reconcile-list">
                {matched.map((r) => (
                  <ReconciliationRow
                    key={r.id}
                    date={r.date}
                    description={r.description}
                    amount={r.amount}
                    status={r.status}
                    match={r.match}
                  />
                ))}
              </div>
            </Stack>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <Inline gap="2.5rem" className="finance-demo__reconcile-totals">
            <Stack gap="0.25rem" className="finance-demo__centered-stack">
              <span className="finance-demo__muted">Bank total</span>
              <strong className="finance-demo__reconcile-total-value">
                {formatCurrency(bankTotal)}
              </strong>
            </Stack>
            <Stack gap="0.25rem" className="finance-demo__centered-stack">
              <span className="finance-demo__muted">Matched in books</span>
              <strong className="finance-demo__reconcile-total-value">
                {formatCurrency(matchedTotal)}
              </strong>
            </Stack>
            <Stack gap="0.25rem" className="finance-demo__centered-stack">
              <span className="finance-demo__muted">Difference</span>
              <strong
                className={cn(
                  'finance-demo__reconcile-total-value',
                  difference === 0
                    ? 'finance-demo__reconcile-total-value--ok'
                    : 'finance-demo__reconcile-total-value--warn',
                )}
              >
                {formatCurrency(difference)}
              </strong>
            </Stack>
          </Inline>
        </CardBody>
      </Card>
    </Stack>
  );
}
