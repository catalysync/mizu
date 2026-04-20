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

interface FinanceShellProps {
  active: string;
  breadcrumbs: { label: string; href?: string }[];
  children: React.ReactNode;
}

export function FinanceShell({ active, breadcrumbs, children }: FinanceShellProps) {
  return (
    <AppLayout data-mizu-theme="finance">
      <AppHeader
        brand={<>aspect books</>}
        actions={
          <Input
            size="sm"
            placeholder="Search invoices, customers…"
            aria-label="Search"
            className="mizu-app-header__search"
          />
        }
      />
      <AppSidebar ariaLabel="Finance navigation">
        <AppSidebarSection>
          <AppSidebarItem href="#" active={active === 'overview'}>
            Overview
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'invoices'}>
            Invoices
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'customers'}>
            Customers
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'transactions'}>
            Transactions
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'reconciliation'}>
            Reconciliation
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'reports'}>
            Reports
          </AppSidebarItem>
        </AppSidebarSection>
        <AppSidebarSection label="Setup">
          <AppSidebarItem href="#" active={active === 'accounts'}>
            Chart of accounts
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'settings'}>
            Settings
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
