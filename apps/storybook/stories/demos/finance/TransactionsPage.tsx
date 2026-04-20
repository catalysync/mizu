import { LedgerRow, formatCurrency } from '@aspect/finance';
import {
  AppContentHeader,
  Button,
  Card,
  CardBody,
  DateRangePicker,
  Field,
  Inline,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
} from '@aspect/react';
import { useMemo, useState } from 'react';
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
              <div className="finance-demo__filter-date">
                <Field label="Date range">
                  <DateRangePicker value={range} onValueChange={setRange} />
                </Field>
              </div>
              <div className="finance-demo__filter-category">
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
              <div className="finance-demo__flex-1">
                <Field label="Search">
                  <Input
                    placeholder="Search description…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </Field>
              </div>
            </Inline>

            <div role="table" aria-label="Transactions ledger" className="finance-demo__ledger">
              <div className="finance-demo__ledger-head">
                <span>Date</span>
                <span>Description</span>
                <span>Ref</span>
                <span>Debit</span>
                <span>Credit</span>
                <span>Balance</span>
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
              <span className="finance-demo__muted">
                Debits: <strong>{formatCurrency(totalDebit)}</strong>
              </span>
              <span className="finance-demo__muted">
                Credits:{' '}
                <strong className="finance-demo__tx-credit">{formatCurrency(totalCredit)}</strong>
              </span>
              <span className="finance-demo__muted">
                Net: <strong>{formatCurrency(totalCredit - totalDebit)}</strong>
              </span>
            </Inline>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}
