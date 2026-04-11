import {
  AppContentHeader,
  Badge,
  Button,
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
            <div style={{ flex: '0 0 14rem' }}>
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
            <div style={{ flex: '0 0 10rem' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Card>
          <CardBody>
            <Stack gap="0.75rem">
              <Inline gap="0.5rem" align="center">
                <strong>Unmatched</strong>
                <Badge tone="warning">{unmatched.length}</Badge>
              </Inline>
              <div style={{ border: '1px solid var(--mizu-border-subtle)', borderRadius: 6 }}>
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
              <div style={{ border: '1px solid var(--mizu-border-subtle)', borderRadius: 6 }}>
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
          <Inline gap="2.5rem" style={{ justifyContent: 'center' }}>
            <Stack gap="0.25rem" style={{ alignItems: 'center' }}>
              <span style={{ color: 'var(--mizu-text-secondary)' }}>Bank total</span>
              <strong style={{ fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums' }}>
                {formatCurrency(bankTotal)}
              </strong>
            </Stack>
            <Stack gap="0.25rem" style={{ alignItems: 'center' }}>
              <span style={{ color: 'var(--mizu-text-secondary)' }}>Matched in books</span>
              <strong style={{ fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums' }}>
                {formatCurrency(matchedTotal)}
              </strong>
            </Stack>
            <Stack gap="0.25rem" style={{ alignItems: 'center' }}>
              <span style={{ color: 'var(--mizu-text-secondary)' }}>Difference</span>
              <strong
                style={{
                  fontSize: '1.25rem',
                  fontVariantNumeric: 'tabular-nums',
                  color:
                    difference === 0
                      ? 'var(--mizu-feedback-success-default)'
                      : 'var(--mizu-feedback-warning-default)',
                }}
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
