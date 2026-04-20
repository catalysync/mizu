import {
  InvoiceLineItem,
  computeLineTotal,
  formatCurrency,
  type InvoiceLineItemValue,
} from '@aspect/finance';
import {
  AppContentHeader,
  Badge,
  Button,
  Card,
  CardBody,
  DatePicker,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Field,
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
} from '@aspect/react';
import { useMemo, useState } from 'react';
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
            <Inline gap="0.5rem" align="center" className="finance-demo__between">
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
                className="finance-demo__invoice-search"
              />
            </Inline>

            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Number</TableHeader>
                  <TableHeader>Customer</TableHeader>
                  <TableHeader>Issued</TableHeader>
                  <TableHeader>Due</TableHeader>
                  <TableHeader className="finance-demo__th-end">Amount</TableHeader>
                  <TableHeader className="finance-demo__th-end">Balance</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((inv) => (
                  <TableRow
                    key={inv.id}
                    onClick={() => setSelected(inv)}
                    className="finance-demo__row-clickable"
                  >
                    <TableCell>
                      <strong>{inv.number}</strong>
                    </TableCell>
                    <TableCell>{inv.customerName}</TableCell>
                    <TableCell>{inv.issuedOn}</TableCell>
                    <TableCell>{inv.dueOn}</TableCell>
                    <TableCell className="finance-demo__num--end">
                      {formatCurrency(inv.amount)}
                    </TableCell>
                    <TableCell className="finance-demo__num--end">
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
        <DrawerContent side="right" className="finance-demo__drawer-content">
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
            <div className="finance-demo__flex-1">
              <Field label="Issued on">
                <DatePicker defaultValue={invoice.issuedOn} />
              </Field>
            </div>
            <div className="finance-demo__flex-1">
              <Field label="Due on">
                <DatePicker defaultValue={invoice.dueOn} />
              </Field>
            </div>
          </Inline>

          <Stack gap="0.25rem">
            <strong>Line items</strong>
            <div className="finance-demo__drawer-lines">
              {lines.map((line) => (
                <InvoiceLineItem key={line.id} value={line} onChange={update} onRemove={remove} />
              ))}
            </div>
            <div className="finance-demo__drawer-add-line">
              <Button variant="ghost" size="sm" onClick={addLine}>
                + Add line
              </Button>
            </div>
          </Stack>

          <Stack gap="0.25rem" className="finance-demo__subtotal">
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
        <Inline gap="0.5rem" className="finance-demo__drawer-right">
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
    <Inline gap="1rem" className="finance-demo__between">
      <span className="finance-demo__muted">{label}</span>
      <span className={strong ? 'finance-demo__num--strong' : 'finance-demo__num'}>{value}</span>
    </Inline>
  );
}
