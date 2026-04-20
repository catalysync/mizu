import type { OutputFile, RenderContext } from '@/lib/patterns/types';
import { definePattern } from '@/lib/patterns/types';
import { formatCurrency } from '@aspect/finance';
import {
  Badge,
  Button,
  Card,
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

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  lastOrder: string;
  status: 'active' | 'inactive';
}

const customers: CustomerRow[] = [
  {
    id: '1',
    name: 'Amara Okafor',
    email: 'amara@example.com',
    orders: 14,
    spent: 2340,
    lastOrder: '2 days ago',
    status: 'active',
  },
  {
    id: '2',
    name: 'Tobi Adebayo',
    email: 'tobi@example.com',
    orders: 8,
    spent: 1120,
    lastOrder: '1 week ago',
    status: 'active',
  },
  {
    id: '3',
    name: 'Chidi Eze',
    email: 'chidi@example.com',
    orders: 3,
    spent: 420,
    lastOrder: '2 months ago',
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Fatima Sani',
    email: 'fatima@example.com',
    orders: 22,
    spent: 4180,
    lastOrder: '4 days ago',
    status: 'active',
  },
];

function Preview() {
  const activeCount = customers.filter((c) => c.status === 'active').length;
  const totalSpent = customers.reduce((sum, c) => sum + c.spent, 0);

  return (
    <Stack gap="1rem">
      <Inline gap="0.75rem" align="center">
        <Input size="sm" placeholder="Search customers…" aria-label="Search customers" />
        <Badge tone="neutral">All ({customers.length})</Badge>
        <Badge tone="success">Active ({activeCount})</Badge>
        <Badge tone="warning">Inactive ({customers.length - activeCount})</Badge>
        <Button size="sm" variant="primary">
          Add customer
        </Button>
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

const TEMPLATE = `import {
  Badge,
  Button,
  Card,
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
import { formatCurrency } from '@aspect/finance';

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  lastOrder: string;
  status: 'active' | 'inactive';
}

const customers: CustomerRow[] = [
  { id: '1', name: 'Amara Okafor', email: 'amara@example.com', orders: 14, spent: 2340, lastOrder: '2 days ago', status: 'active' },
  { id: '2', name: 'Tobi Adebayo', email: 'tobi@example.com', orders: 8, spent: 1120, lastOrder: '1 week ago', status: 'active' },
  { id: '3', name: 'Chidi Eze', email: 'chidi@example.com', orders: 3, spent: 420, lastOrder: '2 months ago', status: 'inactive' },
  { id: '4', name: 'Fatima Sani', email: 'fatima@example.com', orders: 22, spent: 4180, lastOrder: '4 days ago', status: 'active' },
];

export default function CustomersPage() {
  const activeCount = customers.filter((c) => c.status === 'active').length;
  const totalSpent = customers.reduce((sum, c) => sum + c.spent, 0);

  return (
    <Stack gap="1rem">
      <Inline gap="0.75rem" align="center">
        <Input size="sm" placeholder="Search customers…" aria-label="Search customers" />
        <Badge tone="neutral">All ({customers.length})</Badge>
        <Badge tone="success">Active ({activeCount})</Badge>
        <Badge tone="warning">Inactive ({customers.length - activeCount})</Badge>
        <Button size="sm" variant="primary">Add customer</Button>
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
                <TableCell><strong>{c.name}</strong></TableCell>
                <TableCell><span style={{ color: 'var(--mizu-text-secondary)' }}>{c.email}</span></TableCell>
                <TableCell>{c.orders}</TableCell>
                <TableCell>{formatCurrency(c.spent)}</TableCell>
                <TableCell>{c.lastOrder}</TableCell>
                <TableCell>
                  <Badge tone={c.status === 'active' ? 'success' : 'warning'} dot>{c.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Pagination
        label={\`Showing 1–\${customers.length} of \${customers.length} customers\`}
        hasPrevious={false}
        hasNext={false}
      />
    </Stack>
  );
}
`;

export const commerceCustomers = definePattern({
  meta: {
    id: 'commerce.customers',
    name: 'Commerce Customers Table',
    description:
      'Customers page with search/filter pills, compact data table, pagination, and summary KPI card.',
    kind: 'page',
    industries: ['ecommerce'],
    tier: 'free',
    depends: [
      '@aspect/react#Card',
      '@aspect/react#Table',
      '@aspect/react#Input',
      '@aspect/react#Badge',
      '@aspect/react#Button',
      '@aspect/react#Stack',
      '@aspect/react#Inline',
      '@aspect/commerce#Pagination',
      '@aspect/finance#formatCurrency',
    ],
    sources: [
      {
        system: 'mizu-storybook-commerce-demo',
        relationship: 'concept-reference',
        notes: 'Ported from apps/storybook/stories/demos/commerce/CustomersPage.tsx',
      },
      {
        system: 'polaris',
        relationship: 'ia-borrowed',
        notes: 'Customers table structure + status pills echo Shopify Polaris customers index.',
      },
      {
        system: 'stripe',
        relationship: 'visual-rhythm',
        notes: 'KPI summary strip at the bottom is a Stripe dashboard convention.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/customers/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});
