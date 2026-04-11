import { useMemo, useState } from 'react';
import {
  AppContentHeader,
  Badge,
  Button,
  Card,
  CardBody,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  Inline,
  Input,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Field,
  DatePicker,
} from '@aspect/react';
import {
  InvoiceLineItem,
  formatCurrency,
  computeLineTotal,
  type InvoiceLineItemValue,
} from '@aspect/finance';
import { invoices, type Invoice, type InvoiceStatus } from './data';

const STATUSES: ('all' | InvoiceStatus)[] = ['all', 'draft', 'sent', 'paid', 'overdue'];

function toneFor(s: InvoiceStatus): 'success' | 'warning' | 'danger' | 'neutral' {
  if (s === 'paid') return 'success';
  if (s === 'overdue') return 'danger';
  if (s === 'sent') return 'warning';
  return 'neutral';
}

export function InvoicesPage() {
  const [filter, setFilter] = useState<'all' | InvoiceStatus>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [page, setPage] = useState(1);

  const visible = useMemo(() => {
    return invoices.filter((i) => {
      if (filter !== 'all' && i.status !== filter) return false;
      if (query && !i.customerName.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [filter, query]);

  const totalOpen = invoices.filter((i) => i.status !== 'paid').length;

  return (
    <Stack gap="1.5rem">
      <AppContentHeader
        title="Invoices"
        description={`${invoices.length} total · ${totalOpen} outstanding`}
        actions={
          <Inline gap="0.5rem">
            <Button variant="ghost">Export</Button>
            <Button variant="primary" onClick={() => setSelected(invoices[0])}>
              New invoice
            </Button>
          </Inline>
        }
      />

      <Card>
        <CardBody>
          <Stack gap="1rem">
            <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
              <Inline gap="0.25rem">
                {STATUSES.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={filter === s ? 'primary' : 'ghost'}
                    onClick={() => setFilter(s)}
                  >
                    {s[0].toUpperCase() + s.slice(1)}
                  </Button>
                ))}
              </Inline>
              <Input
                size="sm"
                placeholder="Search customer…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search invoices"
                style={{ maxWidth: 260 }}
              />
            </Inline>

            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Number</TableHeader>
                  <TableHeader>Customer</TableHeader>
                  <TableHeader>Issued</TableHeader>
                  <TableHeader>Due</TableHeader>
                  <TableHeader style={{ textAlign: 'end' }}>Amount</TableHeader>
                  <TableHeader style={{ textAlign: 'end' }}>Balance</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((inv) => (
                  <TableRow
                    key={inv.id}
                    onClick={() => setSelected(inv)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <strong>{inv.number}</strong>
                    </TableCell>
                    <TableCell>{inv.customerName}</TableCell>
                    <TableCell>{inv.issuedOn}</TableCell>
                    <TableCell>{inv.dueOn}</TableCell>
                    <TableCell style={{ textAlign: 'end', fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrency(inv.amount)}
                    </TableCell>
                    <TableCell style={{ textAlign: 'end', fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrency(inv.balance)}
                    </TableCell>
                    <TableCell>
                      <Badge tone={toneFor(inv.status)}>{inv.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination
              page={page}
              totalPages={3}
              onPageChange={setPage}
              label={`Showing ${visible.length} of ${invoices.length}`}
            />
          </Stack>
        </CardBody>
      </Card>

      <Drawer open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DrawerContent side="right" style={{ maxWidth: 640 }}>
          {selected && <InvoiceDrawer invoice={selected} />}
        </DrawerContent>
      </Drawer>
    </Stack>
  );
}

function InvoiceDrawer({ invoice }: { invoice: Invoice }) {
  const [lines, setLines] = useState<InvoiceLineItemValue[]>(() =>
    invoice.lines.map((l) => ({
      id: l.id,
      description: l.description,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      taxRate: l.taxRate,
    })),
  );

  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const tax = lines.reduce((s, l) => s + l.quantity * l.unitPrice * (l.taxRate / 100), 0);
  const total = lines.reduce((s, l) => s + computeLineTotal(l), 0);

  const update = (next: InvoiceLineItemValue) => {
    setLines((prev) => prev.map((l) => (l.id === next.id ? next : l)));
  };
  const remove = (id: string) => setLines((prev) => prev.filter((l) => l.id !== id));
  const addLine = () =>
    setLines((prev) => [
      ...prev,
      {
        id: `l${prev.length + 1}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 20,
      },
    ]);

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{invoice.number}</DrawerTitle>
        <Badge tone={toneFor(invoice.status)}>{invoice.status}</Badge>
      </DrawerHeader>
      <DrawerBody>
        <Stack gap="1rem">
          <Field label="Customer">
            <Input defaultValue={invoice.customerName} />
          </Field>
          <Inline gap="1rem">
            <div style={{ flex: 1 }}>
              <Field label="Issued on">
                <DatePicker defaultValue={invoice.issuedOn} />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Due on">
                <DatePicker defaultValue={invoice.dueOn} />
              </Field>
            </div>
          </Inline>

          <Stack gap="0.25rem">
            <strong>Line items</strong>
            <div
              style={{
                borderBottom: '1px solid var(--mizu-border-subtle)',
                paddingBottom: 4,
              }}
            >
              {lines.map((line) => (
                <InvoiceLineItem key={line.id} value={line} onChange={update} onRemove={remove} />
              ))}
            </div>
            <div style={{ marginTop: 4 }}>
              <Button variant="ghost" size="sm" onClick={addLine}>
                + Add line
              </Button>
            </div>
          </Stack>

          <Stack gap="0.25rem" style={{ alignSelf: 'end', minWidth: 260 }}>
            <Row label="Subtotal" value={formatCurrency(subtotal)} />
            <Row label="Tax" value={formatCurrency(tax)} />
            <Row label="Total" value={formatCurrency(total)} strong />
          </Stack>

          <Field label="Notes" showOptionalHint>
            <Input defaultValue={invoice.notes ?? ''} />
          </Field>
        </Stack>
      </DrawerBody>
      <DrawerFooter>
        <Inline gap="0.5rem" style={{ justifyContent: 'flex-end', width: '100%' }}>
          <DrawerClose asChild>
            <Button variant="ghost">Close</Button>
          </DrawerClose>
          <Button variant="ghost">Download PDF</Button>
          <Button variant="primary">Save & send</Button>
        </Inline>
      </DrawerFooter>
    </>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <Inline gap="1rem" style={{ justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--mizu-text-secondary)' }}>{label}</span>
      <span
        style={{
          fontVariantNumeric: 'tabular-nums',
          fontWeight: strong ? 600 : 400,
        }}
      >
        {value}
      </span>
    </Inline>
  );
}
