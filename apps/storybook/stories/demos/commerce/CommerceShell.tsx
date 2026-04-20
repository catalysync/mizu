import {
  AppBreadcrumbs,
  AppContent,
  AppHeader,
  AppLayout,
  AppSidebar,
  AppSidebarItem,
  AppSidebarSection,
  Input,
} from '@aspect/react';

interface CommerceShellProps {
  active: string;
  breadcrumbs: { label: string; href?: string }[];
  children: React.ReactNode;
}

export function CommerceShell({ active, breadcrumbs, children }: CommerceShellProps) {
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
          <AppSidebarItem href="#" active={active === 'products'}>
            Products
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'orders'}>
            Orders
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'customers'}>
            Customers
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'analytics'}>
            Analytics
          </AppSidebarItem>
        </AppSidebarSection>
        <AppSidebarSection label="Settings">
          <AppSidebarItem href="#" active={active === 'shipping'}>
            Shipping
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'payments'}>
            Payments
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'general'}>
            General
          </AppSidebarItem>
        </AppSidebarSection>
      </AppSidebar>
      <AppContent contentType="dashboard">
        <AppBreadcrumbs items={breadcrumbs} />
        {children}
      </AppContent>
    </AppLayout>
  );
}
