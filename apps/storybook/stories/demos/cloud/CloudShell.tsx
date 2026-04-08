import * as React from 'react';
import {
  AppLayout,
  AppHeader,
  AppSidebar,
  AppSidebarSection,
  AppSidebarItem,
  AppContent,
  AppContentHeader,
  AppBreadcrumbs,
  Button,
  Input,
  type BreadcrumbItem,
} from '@aspect/react';
import {
  IconApps,
  IconTemplates,
  IconAddons,
  IconActivity,
  IconBilling,
  IconSettings,
  IconSearch,
  IconCloud,
  IconPlus,
} from './icons';

export type CloudPage = 'apps' | 'templates' | 'addons' | 'activity' | 'billing' | 'settings';

export interface CloudShellProps {
  active: CloudPage;
  breadcrumbs: BreadcrumbItem[];
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryAction?: React.ReactNode;
  children: React.ReactNode;
}

export function CloudShell({
  active,
  breadcrumbs,
  title,
  description,
  primaryAction,
  children,
}: CloudShellProps) {
  return (
    <AppLayout style={{ minHeight: '720px' }} data-mizu-theme="cloud">
      <AppHeader
        brand={
          <>
            <IconCloud />
            aspect cloud
          </>
        }
        actions={
          <>
            <div style={{ position: 'relative', width: '14rem' }}>
              <Input size="sm" placeholder="Search apps, add-ons…" aria-label="Search" />
            </div>
            <Button size="sm" variant="primary">
              <IconPlus />
              <span>New app</span>
            </Button>
          </>
        }
      />
      <AppSidebar ariaLabel="Primary navigation">
        <AppSidebarSection>
          <AppSidebarItem href="#apps" icon={<IconApps />} active={active === 'apps'}>
            Apps
          </AppSidebarItem>
          <AppSidebarItem
            href="#templates"
            icon={<IconTemplates />}
            active={active === 'templates'}
          >
            Templates
          </AppSidebarItem>
          <AppSidebarItem href="#addons" icon={<IconAddons />} active={active === 'addons'}>
            Add-ons
          </AppSidebarItem>
          <AppSidebarItem href="#activity" icon={<IconActivity />} active={active === 'activity'}>
            Activity
          </AppSidebarItem>
        </AppSidebarSection>
        <AppSidebarSection label="Account">
          <AppSidebarItem href="#billing" icon={<IconBilling />} active={active === 'billing'}>
            Billing
          </AppSidebarItem>
          <AppSidebarItem href="#settings" icon={<IconSettings />} active={active === 'settings'}>
            Settings
          </AppSidebarItem>
        </AppSidebarSection>
      </AppSidebar>
      <AppContent contentType="dashboard">
        <AppBreadcrumbs items={breadcrumbs} />
        <AppContentHeader title={title} description={description} actions={primaryAction} />
        {children}
      </AppContent>
    </AppLayout>
  );
}
