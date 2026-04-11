import {
  Badge,
  Button,
  Card,
  CardBody,
  Inline,
  Separator,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';
import { Pagination } from '@aspect/commerce';
import { formatCurrency } from '@aspect/finance';
import { definePattern } from '@/lib/patterns/types';
import type { OutputFile, RenderContext } from '@/lib/patterns/types';

type OrderStatus = 'fulfilled' | 'pending' | 'refunded';

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  date: string;
  status: OrderStatus;
}

const STATUS_TONE: Record<OrderStatus, 'success' | 'warning' | 'danger'> = {
  fulfilled: 'success',
  pending: 'warning',
  refunded: 'danger',
};

const orders: Order[] = [
  {
    id: '#1042',
    customer: 'Sarah Chen',
    items: 3,
    total: 286,
    date: 'Mar 28, 2026',
    status: 'fulfilled',
  },
  {
    id: '#1041',
    customer: 'Tobi Adebayo',
    items: 1,
    total: 129,
    date: 'Mar 27, 2026',
    status: 'pending',
  },
  {
    id: '#1040',
    customer: 'Amara Okafor',
    items: 5,
    total: 412,
    date: 'Mar 26, 2026',
    status: 'fulfilled',
  },
  {
    id: '#1039',
    customer: 'Jamal Reid',
    items: 2,
    total: 198,
    date: 'Mar 26, 2026',
    status: 'refunded',
  },
];

function Preview() {
  const fulfilled = orders.filter((o) => o.status === 'fulfilled').length;
  const pending = orders.filter((o) => o.status === 'pending').length;
  const refunded = orders.filter((o) => o.status === 'refunded').length;

  return (
    <Stack gap="1rem">
      <Inline gap="0.5rem">
        <Badge tone="neutral">All ({orders.length})</Badge>
        <Badge tone="success">Fulfilled ({fulfilled})</Badge>
        <Badge tone="warning">Pending ({pending})</Badge>
        <Badge tone="danger">Refunded ({refunded})</Badge>
        <Button size="sm" variant="ghost">
          Export
        </Button>
        <Button size="sm" variant="primary">
          Create order
        </Button>
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
                  <Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge>
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

const TEMPLATE = `import {
  Badge,
  Button,
  Card,
  CardBody,
  Inline,
  Separator,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';
import { Pagination } from '@aspect/commerce';
import { formatCurrency } from '@aspect/finance';

type OrderStatus = 'fulfilled' | 'pending' | 'refunded';

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  date: string;
  status: OrderStatus;
}

const STATUS_TONE: Record<OrderStatus, 'success' | 'warning' | 'danger'> = {
  fulfilled: 'success',
  pending: 'warning',
  refunded: 'danger',
};

const orders: Order[] = [
  { id: '#1042', customer: 'Sarah Chen', items: 3, total: 286, date: 'Mar 28, 2026', status: 'fulfilled' },
  { id: '#1041', customer: 'Tobi Adebayo', items: 1, total: 129, date: 'Mar 27, 2026', status: 'pending' },
  { id: '#1040', customer: 'Amara Okafor', items: 5, total: 412, date: 'Mar 26, 2026', status: 'fulfilled' },
  { id: '#1039', customer: 'Jamal Reid', items: 2, total: 198, date: 'Mar 26, 2026', status: 'refunded' },
];

export default function OrdersPage() {
  return (
    <Stack gap="1rem">
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
                <TableCell><strong>{o.id}</strong></TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell>{o.items}</TableCell>
                <TableCell>{formatCurrency(o.total)}</TableCell>
                <TableCell>{o.date}</TableCell>
                <TableCell>
                  <Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Pagination
        label={\`Showing 1–\${orders.length} of \${orders.length} orders\`}
        hasPrevious={false}
        hasNext={false}
      />
    </Stack>
  );
}
`;

export const commerceOrders = definePattern({
  meta: {
    id: 'commerce.orders',
    name: 'Commerce Orders Table',
    description:
      'Orders page with status filter pills, compact table with status tones, pagination, and a nested order detail card.',
    kind: 'page',
    industries: ['ecommerce'],
    tier: 'free',
    depends: [
      '@aspect/react#Card',
      '@aspect/react#Table',
      '@aspect/react#Badge',
      '@aspect/react#Button',
      '@aspect/react#Stack',
      '@aspect/react#Inline',
      '@aspect/react#Separator',
      '@aspect/commerce#Pagination',
      '@aspect/finance#formatCurrency',
    ],
    sources: [
      {
        system: 'mizu-storybook-commerce-demo',
        relationship: 'concept-reference',
        notes: 'Ported from apps/storybook/stories/demos/commerce/OrdersPage.tsx',
      },
      {
        system: 'polaris',
        relationship: 'ia-borrowed',
        notes: 'Status-tone pills + compact orders table echoes Shopify Polaris.',
      },
      {
        system: 'stripe',
        relationship: 'visual-rhythm',
        notes:
          'Nested line-items table with subtotal/shipping/total mirrors Stripe invoice details.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/orders/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});
