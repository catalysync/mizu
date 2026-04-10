import {
  AppContentHeader,
  Card,
  CardBody,
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
  Separator,
} from '@aspect/react';
import { formatCurrency } from '@aspect/finance';
import { Pagination } from '@aspect/commerce';
import { orders } from './data';

const statusTone = {
  fulfilled: 'success' as const,
  pending: 'warning' as const,
  refunded: 'danger' as const,
};

export function OrdersPage() {
  return (
    <Stack gap="1rem">
      <AppContentHeader
        title="Orders"
        description={`${orders.length} total orders`}
        actions={
          <Inline gap="0.5rem">
            <Button size="sm" variant="ghost">
              Export
            </Button>
            <Button size="sm" variant="primary">
              Create order
            </Button>
          </Inline>
        }
      />

      <Inline gap="0.5rem">
        <Badge tone="neutral">All ({orders.length})</Badge>
        <Badge tone="success">
          Fulfilled ({orders.filter((o) => o.status === 'fulfilled').length})
        </Badge>
        <Badge tone="warning">
          Pending ({orders.filter((o) => o.status === 'pending').length})
        </Badge>
        <Badge tone="danger">
          Refunded ({orders.filter((o) => o.status === 'refunded').length})
        </Badge>
      </Inline>

      <Card>
        <Table density="compact">
          <TableHead>
            <TableRow>
              <TableHeader>Order</TableHeader>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Items</TableHeader>
              <TableHeader>Total</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <strong>{o.id}</strong>
                </TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell>{o.items}</TableCell>
                <TableCell>{formatCurrency(o.total)}</TableCell>
                <TableCell>{o.date}</TableCell>
                <TableCell>
                  <Badge tone={statusTone[o.status]}>{o.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Pagination
        label={`Showing 1–${orders.length} of ${orders.length} orders`}
        hasPrevious={false}
        hasNext={false}
      />

      <Separator />

      <Card>
        <CardBody>
          <Stack gap="0.5rem">
            <span className="mizu-heading-sm">Order #1042</span>
            <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
              Placed Mar 28, 2026 by Sarah Chen
            </span>
            <Separator />
            <Table density="compact">
              <TableHead>
                <TableRow>
                  <TableHeader>Item</TableHeader>
                  <TableHeader>Qty</TableHeader>
                  <TableHeader>Price</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Minimal Desk Lamp</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>{formatCurrency(89)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Linen Throw Blanket</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>{formatCurrency(68)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Walnut Monitor Riser</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>{formatCurrency(129)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Inline gap="1rem" style={{ justifyContent: 'flex-end' }}>
              <span className="mizu-body--sm">
                Subtotal: <strong>{formatCurrency(286)}</strong>
              </span>
              <span className="mizu-body--sm">
                Shipping: <strong>{formatCurrency(0)}</strong>
              </span>
              <span className="mizu-body--sm">
                Total: <strong>{formatCurrency(286)}</strong>
              </span>
            </Inline>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}
