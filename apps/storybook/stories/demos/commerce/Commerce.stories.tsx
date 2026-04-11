import type { Meta, StoryObj } from '@storybook/react-vite';
import '@aspect/commerce/css';
import {
  AppContentHeader,
  Card,
  Badge,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Grid,
  Stack,
  Pagination,
} from '@aspect/react';
import { KpiCard, DeltaIndicator, formatCurrency } from '@aspect/finance';
import { ResourceItem, Thumbnail, Banner } from '@aspect/commerce';
import { products, orders } from './data';
import { CommerceShell } from './CommerceShell';
import { OrdersPage } from './OrdersPage';
import { CustomersPage } from './CustomersPage';

const statusTone = {
  fulfilled: 'success' as const,
  pending: 'warning' as const,
  refunded: 'danger' as const,
};

function OverviewPage() {
  return (
    <>
      <Banner tone="info" title="Welcome to your store" onDismiss={() => {}}>
        Your products are live. Start customizing your storefront.
      </Banner>

      <Grid gap="1rem" min="14rem">
        <KpiCard label="Revenue" value="$12.4K" footer={<DeltaIndicator value={0.18} />} />
        <KpiCard label="Orders" value="42" footer={<DeltaIndicator value={0.08} />} />
        <KpiCard label="Avg Order" value="$295" footer={<DeltaIndicator value={-0.04} />} />
        <KpiCard
          label="Products"
          value={String(products.length)}
          footer={<span className="mizu-caption">in catalog</span>}
        />
      </Grid>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Stack gap="1rem">
            <AppContentHeader
              title="Products"
              description={`${products.length} items in your catalog`}
              actions={
                <Button size="sm" variant="primary">
                  Add product
                </Button>
              }
            />
            <Card>
              <Stack gap="0">
                {products.map((p) => (
                  <ResourceItem
                    key={p.id}
                    media={
                      <Thumbnail
                        source={`https://picsum.photos/seed/${p.sku}/200`}
                        alt={p.name}
                        size="sm"
                      />
                    }
                    name={p.name}
                    meta={`${p.sku} · ${formatCurrency(p.price)} · ${p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}`}
                    actions={
                      <Badge
                        tone={
                          p.status === 'active'
                            ? 'success'
                            : p.status === 'draft'
                              ? 'neutral'
                              : 'danger'
                        }
                      >
                        {p.status}
                      </Badge>
                    }
                  />
                ))}
              </Stack>
            </Card>
            <Pagination
              label={`Showing 1–${products.length} of ${products.length} products`}
              hasPrevious={false}
              hasNext={false}
            />
          </Stack>
        </TabsContent>
        <TabsContent value="orders">
          <Stack gap="1rem">
            <AppContentHeader title="Orders" description={`${orders.length} recent orders`} />
            <Card>
              <Stack gap="0">
                {orders.map((o) => (
                  <ResourceItem
                    key={o.id}
                    name={o.id}
                    meta={`${o.customer} · ${o.items} items · ${formatCurrency(o.total)} · ${o.date}`}
                    actions={<Badge tone={statusTone[o.status]}>{o.status}</Badge>}
                  />
                ))}
              </Stack>
            </Card>
            <Pagination
              label={`Showing 1–${orders.length} of ${orders.length} orders`}
              hasPrevious={false}
              hasNext={false}
            />
          </Stack>
        </TabsContent>
      </Tabs>
    </>
  );
}

const meta = {
  title: 'Demos/Commerce',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const StoreAdmin: Story = {
  render: () => (
    <CommerceShell
      active="products"
      breadcrumbs={[{ label: 'Store', href: '#' }, { label: 'Overview' }]}
    >
      <OverviewPage />
    </CommerceShell>
  ),
};

export const Orders: Story = {
  render: () => (
    <CommerceShell
      active="orders"
      breadcrumbs={[{ label: 'Store', href: '#' }, { label: 'Orders' }]}
    >
      <OrdersPage />
    </CommerceShell>
  ),
};

export const Customers: Story = {
  render: () => (
    <CommerceShell
      active="customers"
      breadcrumbs={[{ label: 'Store', href: '#' }, { label: 'Customers' }]}
    >
      <CustomersPage />
    </CommerceShell>
  ),
};
