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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';
import { formatCurrency } from '@aspect/finance';
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
              style={{ maxWidth: 320 }}
            />

            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Customer</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader style={{ textAlign: 'end' }}>Balance</TableHeader>
                  <TableHeader style={{ textAlign: 'end' }}>Open invoices</TableHeader>
                  <TableHeader>Last transaction</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((c) => (
                  <TableRow key={c.id} onClick={() => setSelected(c)} style={{ cursor: 'pointer' }}>
                    <TableCell>
                      <strong>{c.name}</strong>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: 'var(--mizu-text-secondary)' }}>{c.email}</span>
                    </TableCell>
                    <TableCell style={{ textAlign: 'end', fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrency(c.balance)}
                    </TableCell>
                    <TableCell style={{ textAlign: 'end', fontVariantNumeric: 'tabular-nums' }}>
                      {c.openInvoices}
                    </TableCell>
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
        <DrawerContent side="right" style={{ maxWidth: 520 }}>
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
            <span style={{ color: 'var(--mizu-text-secondary)' }}>{customer.email}</span>
            <span style={{ color: 'var(--mizu-text-secondary)' }}>
              Last transaction: {customer.lastTransaction}
            </span>
          </Stack>

          <Stack gap="0.25rem">
            <strong>Balance</strong>
            <span
              style={{
                fontSize: '1.5rem',
                fontVariantNumeric: 'tabular-nums',
                color:
                  customer.balance > 0 ? 'var(--mizu-text-primary)' : 'var(--mizu-text-secondary)',
              }}
            >
              {formatCurrency(customer.balance)}
            </span>
            <span style={{ color: 'var(--mizu-text-secondary)' }}>
              {customer.openInvoices} open invoice{customer.openInvoices === 1 ? '' : 's'}
            </span>
          </Stack>

          <Stack gap="0.5rem">
            <strong>Outstanding invoices</strong>
            {outstanding.length === 0 ? (
              <span style={{ color: 'var(--mizu-text-secondary)' }}>None</span>
            ) : (
              outstanding.map((inv) => (
                <Inline
                  key={inv.id}
                  gap="1rem"
                  align="center"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>
                    {inv.number}{' '}
                    <span style={{ color: 'var(--mizu-text-tertiary)', fontSize: '0.875rem' }}>
                      due {inv.dueOn}
                    </span>
                  </span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatCurrency(inv.balance)}
                  </span>
                </Inline>
              ))
            )}
          </Stack>

          <Stack gap="0.5rem">
            <strong>Recently paid</strong>
            {paid.length === 0 ? (
              <span style={{ color: 'var(--mizu-text-secondary)' }}>None</span>
            ) : (
              paid.map((inv) => (
                <Inline
                  key={inv.id}
                  gap="1rem"
                  align="center"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'var(--mizu-text-secondary)' }}>
                    {inv.number} · {inv.issuedOn}
                  </span>
                  <span
                    style={{
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--mizu-text-secondary)',
                    }}
                  >
                    {formatCurrency(inv.amount)}
                  </span>
                </Inline>
              ))
            )}
          </Stack>
        </Stack>
      </DrawerBody>
      <DrawerFooter>
        <Inline gap="0.5rem" style={{ justifyContent: 'flex-end', width: '100%' }}>
          <DrawerClose asChild>
            <Button variant="ghost">Close</Button>
          </DrawerClose>
          <Button variant="primary">New invoice</Button>
        </Inline>
      </DrawerFooter>
    </>
  );
}
