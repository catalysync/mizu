import type { Meta, StoryObj } from '@storybook/react-vite';
import '@aspect/css/themes/ecommerce';
import {
  AppLayout,
  AppHeader,
  AppSidebar,
  AppSidebarSection,
  AppSidebarItem,
  AppContent,
  AppContentHeader,
  AppBreadcrumbs,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
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
import { products, orders } from './data';

const STATUS_TONE = {
  active: 'success' as const,
  draft: 'neutral' as const,
  archived: 'danger' as const,
  fulfilled: 'success' as const,
  pending: 'warning' as const,
  refunded: 'danger' as const,
};

function CommerceAdmin() {
  return (
    <AppLayout style={{ minHeight: '720px' }} data-mizu-theme="ecommerce">
      <AppHeader
        brand={<>aspect store</>}
        actions={<Input size="sm" placeholder="Search…" aria-label="Search" />}
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
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Product</TableHeader>
                    <TableHeader>SKU</TableHeader>
                    <TableHeader>Price</TableHeader>
                    <TableHeader>Stock</TableHeader>
                    <TableHeader>Status</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>
                        <span className="mizu-mono">{p.sku}</span>
                      </TableCell>
                      <TableCell>{formatCurrency(p.price)}</TableCell>
                      <TableCell>{p.stock}</TableCell>
                      <TableCell>
                        <Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Stack>
          </TabsContent>
          <TabsContent value="orders">
            <Stack gap="1rem">
              <AppContentHeader title="Orders" description={`${orders.length} recent orders`} />
              <Table>
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
                        <span className="mizu-mono">{o.id}</span>
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
