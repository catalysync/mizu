import type { OutputFile, RenderContext } from '@/lib/patterns/types';
import { definePattern } from '@/lib/patterns/types';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
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

const invoices = [
  { id: 'INV-2026-03', date: 'Mar 1, 2026', amount: '$49.00', status: 'paid' as const },
  { id: 'INV-2026-02', date: 'Feb 1, 2026', amount: '$49.00', status: 'paid' as const },
  { id: 'INV-2026-01', date: 'Jan 1, 2026', amount: '$29.00', status: 'paid' as const },
  { id: 'INV-2025-12', date: 'Dec 1, 2025', amount: '$29.00', status: 'paid' as const },
];

const usage = [
  { resource: 'Build minutes', used: '842', limit: '1,000', pct: 84 },
  { resource: 'Bandwidth', used: '18.4 GB', limit: '100 GB', pct: 18 },
  { resource: 'Storage', used: '2.1 GB', limit: '5 GB', pct: 42 },
  { resource: 'Apps', used: '7', limit: '10', pct: 70 },
];

function UsageBar({ pct }: { pct: number }) {
  return (
    <div
      style={{
        height: '4px',
        borderRadius: 'var(--mizu-radius-full)',
        background: 'var(--mizu-surface-secondary)',
        marginTop: '0.25rem',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 'var(--mizu-radius-full)',
          background:
            pct > 80
              ? 'var(--mizu-action-destructive-default)'
              : 'var(--mizu-action-primary-default)',
        }}
      />
    </div>
  );
}

function Preview() {
  return (
    <Stack gap="1.5rem">
      <Card>
        <CardHeader title="Current plan" />
        <CardBody>
          <Inline gap="1rem" align="center" style={{ justifyContent: 'space-between' }}>
            <Stack gap="0.25rem">
              <Inline gap="0.5rem" align="center">
                <span className="mizu-heading-md">Pro</span>
                <Badge tone="success">Active</Badge>
              </Inline>
              <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
                $49/month · Renews Apr 1, 2026
              </span>
            </Stack>
            <Button size="sm" variant="secondary">
              Change plan
            </Button>
          </Inline>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Usage this period" description="Mar 1 – Mar 31, 2026" />
        <CardBody>
          <Stack gap="0.75rem">
            {usage.map((u) => (
              <div key={u.resource}>
                <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
                  <span className="mizu-body--sm">{u.resource}</span>
                  <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
                    {u.used} / {u.limit}
                  </span>
                </Inline>
                <UsageBar pct={u.pct} />
              </div>
            ))}
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Invoice history" />
        <CardBody>
          <Table density="compact">
            <TableHead>
              <TableRow>
                <TableHeader>Invoice</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <strong>{inv.id}</strong>
                  </TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell>{inv.amount}</TableCell>
                  <TableCell>
                    <Badge tone="success">{inv.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Separator />
    </Stack>
  );
}

const TEMPLATE = `import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Inline,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';

const invoices = [
  { id: 'INV-2026-03', date: 'Mar 1, 2026', amount: '$49.00', status: 'paid' as const },
  { id: 'INV-2026-02', date: 'Feb 1, 2026', amount: '$49.00', status: 'paid' as const },
  { id: 'INV-2026-01', date: 'Jan 1, 2026', amount: '$29.00', status: 'paid' as const },
  { id: 'INV-2025-12', date: 'Dec 1, 2025', amount: '$29.00', status: 'paid' as const },
];

const usage = [
  { resource: 'Build minutes', used: '842', limit: '1,000', pct: 84 },
  { resource: 'Bandwidth', used: '18.4 GB', limit: '100 GB', pct: 18 },
  { resource: 'Storage', used: '2.1 GB', limit: '5 GB', pct: 42 },
  { resource: 'Apps', used: '7', limit: '10', pct: 70 },
];

export default function BillingPage() {
  return (
    <Stack gap="1.5rem">
      <Card>
        <CardHeader title="Current plan" />
        <CardBody>
          <Inline gap="1rem" align="center" style={{ justifyContent: 'space-between' }}>
            <Stack gap="0.25rem">
              <Inline gap="0.5rem" align="center">
                <span className="mizu-heading-md">Pro</span>
                <Badge tone="success">Active</Badge>
              </Inline>
              <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
                $49/month · Renews Apr 1, 2026
              </span>
            </Stack>
            <Button size="sm" variant="secondary">Change plan</Button>
          </Inline>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Usage this period" description="Mar 1 – Mar 31, 2026" />
        <CardBody>
          <Stack gap="0.75rem">
            {usage.map((u) => (
              <div key={u.resource}>
                <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
                  <span className="mizu-body--sm">{u.resource}</span>
                  <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
                    {u.used} / {u.limit}
                  </span>
                </Inline>
                <div style={{ height: '4px', borderRadius: 'var(--mizu-radius-full)', background: 'var(--mizu-surface-secondary)', marginTop: '0.25rem' }}>
                  <div style={{ height: '100%', width: \`\${u.pct}%\`, borderRadius: 'var(--mizu-radius-full)', background: u.pct > 80 ? 'var(--mizu-action-destructive-default)' : 'var(--mizu-action-primary-default)' }} />
                </div>
              </div>
            ))}
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Invoice history" />
        <CardBody>
          <Table density="compact">
            <TableHead>
              <TableRow>
                <TableHeader>Invoice</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell><strong>{inv.id}</strong></TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell>{inv.amount}</TableCell>
                  <TableCell><Badge tone="success">{inv.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </Stack>
  );
}
`;

export const cloudBilling = definePattern({
  meta: {
    id: 'cloud.billing',
    name: 'Cloud Billing Page',
    description:
      'Subscription billing page with current plan card, usage meters with threshold colors, and invoice history table.',
    kind: 'page',
    industries: ['cloud', 'saas-admin'],
    tier: 'free',
    depends: [
      '@aspect/react#Card',
      '@aspect/react#Badge',
      '@aspect/react#Button',
      '@aspect/react#Stack',
      '@aspect/react#Inline',
      '@aspect/react#Table',
      '@aspect/react#Separator',
    ],
    sources: [
      {
        system: 'mizu-storybook-cloud-demo',
        relationship: 'concept-reference',
        notes: 'Ported from apps/storybook/stories/demos/cloud/BillingPage.tsx',
      },
      {
        system: 'stripe',
        relationship: 'ia-borrowed',
        notes: 'Plan card + usage meters + invoice table pattern mirrors Stripe dashboard billing.',
      },
      {
        system: 'vercel',
        relationship: 'visual-rhythm',
        notes: 'Usage meter threshold coloring inspired by Vercel usage dashboard.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/billing/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});
