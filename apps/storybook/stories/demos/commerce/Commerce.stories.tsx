import type { Meta, StoryObj } from '@storybook/react-vite';
import '@aspect/commerce/css';
import {
  AppLayout,
  AppHeader,
  AppSidebar,
  AppSidebarSection,
  AppSidebarItem,
  AppContent,
  AppContentHeader,
  AppBreadcrumbs,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Grid,
  Stack,
} from '@aspect/react';
import { KpiCard, DeltaIndicator, formatCurrency } from '@aspect/finance';
import { ResourceItem, Thumbnail, Pagination, Banner } from '@aspect/commerce';
import { products, orders } from './data';

function CommerceAdmin() {
  return (
    <AppLayout data-mizu-theme="ecommerce">
      <AppHeader
        brand={<>aspect store</>}
        actions={
          <Input
            size="sm"
            placeholder="Search…"
            aria-label="Search"
            className="mizu-app-header__search"
          />
        }
      />
      <AppSidebar ariaLabel="Store admin">
        <AppSidebarSection>
          <AppSidebarItem href="#" active>
            Products
          </AppSidebarItem>
          <AppSidebarItem href="#">Orders</AppSidebarItem>
          <AppSidebarItem href="#">Customers</AppSidebarItem>
          <AppSidebarItem href="#">Analytics</AppSidebarItem>
        </AppSidebarSection>
        <AppSidebarSection label="Settings">
          <AppSidebarItem href="#">Shipping</AppSidebarItem>
          <AppSidebarItem href="#">Payments</AppSidebarItem>
          <AppSidebarItem href="#">General</AppSidebarItem>
        </AppSidebarSection>
      </AppSidebar>
      <AppContent contentType="dashboard">
        <AppBreadcrumbs items={[{ label: 'Store', href: '#' }, { label: 'Overview' }]} />

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
                      actions={
                        <Badge
                          tone={
                            o.status === 'fulfilled'
                              ? 'success'
                              : o.status === 'pending'
                                ? 'warning'
                                : 'danger'
                          }
                        >
                          {o.status}
                        </Badge>
                      }
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
      </AppContent>
    </AppLayout>
  );
}

const meta = {
  title: 'Demos/Commerce',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const StoreAdmin: Story = {
  render: () => <CommerceAdmin />,
};
