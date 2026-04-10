import {
  AppLayout,
  AppHeader,
  AppSidebar,
  AppSidebarSection,
  AppSidebarItem,
  AppContent,
  Badge,
  Button,
  Input,
  Inline,
} from '@aspect/react';

interface ConversationsShellProps {
  active: string;
  children: React.ReactNode;
}

export function ConversationsShell({ active, children }: ConversationsShellProps) {
  return (
    <AppLayout data-mizu-theme="customer-engagement">
      <AppHeader
        brand={<>aspect support</>}
        actions={
          <Inline gap="0.5rem" align="center">
            <Badge tone="info">2 unread</Badge>
            <Button size="sm" variant="primary">
              New conversation
            </Button>
          </Inline>
        }
      />
      <AppSidebar ariaLabel="Support navigation">
        <div className="mizu-form-group">
          <Input size="sm" placeholder="Search…" aria-label="Search" />
        </div>
        <AppSidebarSection>
          <AppSidebarItem href="#" active={active === 'inbox'}>
            Inbox
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'contacts'}>
            Contacts
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'saved-replies'}>
            Saved Replies
          </AppSidebarItem>
        </AppSidebarSection>
        <AppSidebarSection label="Views">
          <AppSidebarItem href="#" active={active === 'unassigned'}>
            Unassigned
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'mine'}>
            Assigned to me
          </AppSidebarItem>
          <AppSidebarItem href="#" active={active === 'resolved'}>
            Resolved
          </AppSidebarItem>
        </AppSidebarSection>
      </AppSidebar>
      <AppContent>{children}</AppContent>
    </AppLayout>
  );
}
