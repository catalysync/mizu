import {
  AppContentHeader,
  Card,
  Badge,
  Button,
  Stack,
  Inline,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Input,
  Pagination,
} from '@aspect/react';
import { formatCurrency } from '@aspect/finance';
import { customers } from './data';

export function CustomersPage() {
  const activeCount = customers.filter((c) => c.status === 'active').length;
  const totalSpent = customers.reduce((sum, c) => sum + c.spent, 0);

  return (
    <Stack gap="1rem">
      <AppContentHeader
        title="Customers"
        description={`${customers.length} customers · ${activeCount} active`}
        actions={
          <Button size="sm" variant="primary">
            Add customer
          </Button>
        }
      />

      <Inline gap="0.75rem" align="center">
        <Input size="sm" placeholder="Search customers…" aria-label="Search customers" />
        <Badge tone="neutral">All ({customers.length})</Badge>
        <Badge tone="success">Active ({activeCount})</Badge>
        <Badge tone="warning">Inactive ({customers.length - activeCount})</Badge>
      </Inline>

      <Card>
        <Table density="compact">
          <TableHead>
            <TableRow>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Orders</TableHeader>
              <TableHeader>Total spent</TableHeader>
              <TableHeader>Last order</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <strong>{c.name}</strong>
                </TableCell>
                <TableCell>
                  <span style={{ color: 'var(--mizu-text-secondary)' }}>{c.email}</span>
                </TableCell>
                <TableCell>{c.orders}</TableCell>
                <TableCell>{formatCurrency(c.spent)}</TableCell>
                <TableCell>{c.lastOrder}</TableCell>
                <TableCell>
                  <Badge tone={c.status === 'active' ? 'success' : 'warning'} dot>
                    {c.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Pagination
        label={`Showing 1–${customers.length} of ${customers.length} customers`}
        hasPrevious={false}
        hasNext={false}
      />

      <Card>
        <Stack gap="0.5rem" style={{ padding: '1rem' }}>
          <span className="mizu-heading-sm">Customer summary</span>
          <Inline gap="2rem">
            <Stack gap="0.25rem">
              <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
                Total customers
              </span>
              <span className="mizu-heading-lg">{customers.length}</span>
            </Stack>
            <Stack gap="0.25rem">
              <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
                Total revenue
              </span>
              <span className="mizu-heading-lg">{formatCurrency(totalSpent)}</span>
            </Stack>
            <Stack gap="0.25rem">
              <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
                Avg per customer
              </span>
              <span className="mizu-heading-lg">
                {formatCurrency(Math.round(totalSpent / customers.length))}
              </span>
            </Stack>
          </Inline>
        </Stack>
      </Card>
    </Stack>
  );
}
