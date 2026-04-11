import { useMemo, useState } from 'react';
import {
  AppContentHeader,
  Button,
  Card,
  CardBody,
  DateRangePicker,
  Field,
  Input,
  Inline,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
} from '@aspect/react';
import { LedgerRow, formatCurrency } from '@aspect/finance';
import { transactions } from './data';

const CATEGORIES = [
  'all',
  'Revenue',
  'Office rent',
  'Software',
  'Travel',
  'Payroll',
  'Professional services',
];

export function TransactionsPage() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [range, setRange] = useState({ start: '2026-04-01', end: '2026-04-30' });

  const visible = useMemo(
    () =>
      transactions.filter((t) => {
        if (category !== 'all' && t.category !== category) return false;
        if (query && !t.description.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      }),
    [category, query],
  );

  // Running balance from first to last row.
  const rows = useMemo(() => {
    let balance = 0;
    return visible.map((t) => {
      balance += t.credit - t.debit;
      return { ...t, balance };
    });
  }, [visible]);

  const totalDebit = visible.reduce((s, t) => s + t.debit, 0);
  const totalCredit = visible.reduce((s, t) => s + t.credit, 0);

  return (
    <Stack gap="1.5rem">
      <AppContentHeader
        title="Transactions"
        description={`${visible.length} entries in view`}
        actions={<Button variant="primary">New entry</Button>}
      />

      <Card>
        <CardBody>
          <Stack gap="1rem">
            <Inline gap="0.75rem" align="end">
              <div style={{ flex: '0 0 14rem' }}>
                <Field label="Date range">
                  <DateRangePicker value={range} onValueChange={setRange} />
                </Field>
              </div>
              <div style={{ flex: '0 0 10rem' }}>
                <Field label="Category">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c === 'all' ? 'All categories' : c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div style={{ flex: 1 }}>
                <Field label="Search">
                  <Input
                    placeholder="Search description…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </Field>
              </div>
            </Inline>

            <div
              role="table"
              aria-label="Transactions ledger"
              style={{ border: '1px solid var(--mizu-border-default)', borderRadius: 6 }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '6rem minmax(0, 2fr) 6rem 7rem 7rem 7rem',
                  gap: 'var(--mizu-spacing-2)',
                  padding: 'var(--mizu-spacing-2) var(--mizu-spacing-3)',
                  background: 'var(--mizu-surface-secondary)',
                  borderBottom: '1px solid var(--mizu-border-default)',
                  fontFamily: 'var(--mizu-font-family-sans)',
                  fontSize: 'var(--mizu-font-size-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--mizu-text-secondary)',
                }}
              >
                <span>Date</span>
                <span>Description</span>
                <span>Ref</span>
                <span style={{ textAlign: 'end' }}>Debit</span>
                <span style={{ textAlign: 'end' }}>Credit</span>
                <span style={{ textAlign: 'end' }}>Balance</span>
              </div>
              {rows.map((t) => (
                <LedgerRow
                  key={t.id}
                  date={t.date}
                  description={t.description}
                  reference={t.reference}
                  debit={t.debit}
                  credit={t.credit}
                  balance={t.balance}
                />
              ))}
              <LedgerRow
                kind="subtotal"
                description="Totals"
                debit={totalDebit}
                credit={totalCredit}
                balance={rows[rows.length - 1]?.balance ?? 0}
              />
            </div>

            <Inline gap="2rem">
              <span style={{ color: 'var(--mizu-text-secondary)' }}>
                Debits:{' '}
                <strong style={{ color: 'var(--mizu-text-primary)' }}>
                  {formatCurrency(totalDebit)}
                </strong>
              </span>
              <span style={{ color: 'var(--mizu-text-secondary)' }}>
                Credits:{' '}
                <strong style={{ color: 'var(--mizu-feedback-success-default)' }}>
                  {formatCurrency(totalCredit)}
                </strong>
              </span>
              <span style={{ color: 'var(--mizu-text-secondary)' }}>
                Net:{' '}
                <strong style={{ color: 'var(--mizu-text-primary)' }}>
                  {formatCurrency(totalCredit - totalDebit)}
                </strong>
              </span>
            </Inline>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}
