import { formatCurrency } from '@aspect/finance';
import {
  AppContentHeader,
  Badge,
  Button,
  Card,
  CardBody,
  cn,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Inline,
  Input,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';
import { useMemo, useState } from 'react';
import { customers, invoices, type Customer, type CustomerStatus } from './data';

function toneFor(s: CustomerStatus): 'success' | 'warning' | 'neutral' {
  if (s === 'active') return 'success';
  if (s === 'lead') return 'warning';
  return 'neutral';
}

export function CustomersPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);

  const visible = useMemo(
    () =>
      customers.filter((c) => (query ? c.name.toLowerCase().includes(query.toLowerCase()) : true)),
    [query],
  );

  const activeCount = customers.filter((c) => c.status === 'active').length;
  const totalBalance = customers.reduce((s, c) => s + c.balance, 0);

  return (
    <Stack gap="1.5rem">
      <AppContentHeader
        title="Customers"
        description={`${customers.length} total · ${activeCount} active · ${formatCurrency(
          totalBalance,
        )} outstanding`}
        actions={<Button variant="primary">New customer</Button>}
      />

      <Card>
        <CardBody>
          <Stack gap="1rem">
            <Input
              size="sm"
              placeholder="Search by name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search customers"
              className="finance-demo__customer-search"
            />

            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Customer</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader className="finance-demo__th-end">Balance</TableHeader>
                  <TableHeader className="finance-demo__th-end">Open invoices</TableHeader>
                  <TableHeader>Last transaction</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((c) => (
                  <TableRow
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="finance-demo__row-clickable"
                  >
                    <TableCell>
                      <strong>{c.name}</strong>
                    </TableCell>
                    <TableCell>
                      <span className="finance-demo__muted">{c.email}</span>
                    </TableCell>
                    <TableCell className="finance-demo__num--end">
                      {formatCurrency(c.balance)}
                    </TableCell>
                    <TableCell className="finance-demo__num--end">{c.openInvoices}</TableCell>
                    <TableCell>{c.lastTransaction}</TableCell>
                    <TableCell>
                      <Badge tone={toneFor(c.status)}>{c.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </CardBody>
      </Card>

      <Drawer open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DrawerContent side="right" className="finance-demo__customer-drawer">
          {selected && <CustomerDrawer customer={selected} />}
        </DrawerContent>
      </Drawer>
    </Stack>
  );
}

function CustomerDrawer({ customer }: { customer: Customer }) {
  const customerInvoices = invoices.filter((i) => i.customerId === customer.id);
  const paid = customerInvoices.filter((i) => i.status === 'paid');
  const outstanding = customerInvoices.filter((i) => i.status !== 'paid');

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{customer.name}</DrawerTitle>
        <Badge tone={customer.status === 'active' ? 'success' : 'neutral'}>{customer.status}</Badge>
      </DrawerHeader>
      <DrawerBody>
        <Stack gap="1rem">
          <Stack gap="0.25rem">
            <strong>Contact</strong>
            <span className="finance-demo__muted">{customer.email}</span>
            <span className="finance-demo__muted">
              Last transaction: {customer.lastTransaction}
            </span>
          </Stack>

          <Stack gap="0.25rem">
            <strong>Balance</strong>
            <span
              className={cn(
                'finance-demo__drawer-balance',
                customer.balance > 0 ? 'finance-demo__balance' : 'finance-demo__balance--zero',
              )}
            >
              {formatCurrency(customer.balance)}
            </span>
            <span className="finance-demo__muted">
              {customer.openInvoices} open invoice{customer.openInvoices === 1 ? '' : 's'}
            </span>
          </Stack>

          <Stack gap="0.5rem">
            <strong>Outstanding invoices</strong>
            {outstanding.length === 0 ? (
              <span className="finance-demo__muted">None</span>
            ) : (
              outstanding.map((inv) => (
                <Inline key={inv.id} gap="1rem" align="center" className="finance-demo__between">
                  <span>
                    {inv.number} <span className="finance-demo__hint-sm">due {inv.dueOn}</span>
                  </span>
                  <span className="finance-demo__num">{formatCurrency(inv.balance)}</span>
                </Inline>
              ))
            )}
          </Stack>

          <Stack gap="0.5rem">
            <strong>Recently paid</strong>
            {paid.length === 0 ? (
              <span className="finance-demo__muted">None</span>
            ) : (
              paid.map((inv) => (
                <Inline key={inv.id} gap="1rem" align="center" className="finance-demo__between">
                  <span className="finance-demo__muted">
                    {inv.number} · {inv.issuedOn}
                  </span>
                  <span className="finance-demo__num finance-demo__muted">
                    {formatCurrency(inv.amount)}
                  </span>
                </Inline>
              ))
            )}
          </Stack>
        </Stack>
      </DrawerBody>
      <DrawerFooter>
        <Inline gap="0.5rem" className="finance-demo__drawer-right">
          <DrawerClose asChild>
            <Button variant="ghost">Close</Button>
          </DrawerClose>
          <Button variant="primary">New invoice</Button>
        </Inline>
      </DrawerFooter>
    </>
  );
}
