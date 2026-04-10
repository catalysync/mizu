import type { Meta, StoryObj } from '@storybook/react-vite';
import { formatCompact } from '@aspect/finance';
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
  Stack,
  Inline,
} from '@aspect/react';
import { datasets, workspace, type WorkspaceItem } from './data';

const STATUS_TONE = {
  healthy: 'success' as const,
  stale: 'warning' as const,
  error: 'danger' as const,
};

const TYPE_ICON: Record<WorkspaceItem['type'], string> = {
  folder: '📁',
  dataset: '🗃️',
  pipeline: '⚙️',
  dashboard: '📊',
};

function TreeItem({ item, depth = 0 }: { item: WorkspaceItem; depth?: number }) {
  return (
    <>
      <AppSidebarItem href={`#${item.id}`} style={{ paddingLeft: `${0.75 + depth * 1}rem` }}>
        <span>{TYPE_ICON[item.type]}</span>
        {item.label}
      </AppSidebarItem>
      {item.children?.map((child) => (
        <TreeItem key={child.id} item={child} depth={depth + 1} />
      ))}
    </>
  );
}

function AnalyticsWorkspace() {
  return (
    <AppLayout
      style={{ minHeight: '720px' }}
      data-mizu-theme="analytics"
      data-mizu-density="compact"
    >
      <AppHeader
        brand={<>aspect analytics</>}
        actions={<Input size="sm" placeholder="Search datasets…" aria-label="Search" />}
      />
      <AppSidebar ariaLabel="Workspace">
        <AppSidebarSection label="Workspace">
          {workspace.map((item) => (
            <TreeItem key={item.id} item={item} />
          ))}
        </AppSidebarSection>
      </AppSidebar>
      <AppContent contentType="table">
        <AppBreadcrumbs items={[{ label: 'Workspace', href: '#' }, { label: 'All Datasets' }]} />
        <AppContentHeader
          title="Datasets"
          description={`${datasets.length} datasets across all teams`}
          actions={
            <Button size="sm" variant="primary">
              New dataset
            </Button>
          }
        />
        <Table density="compact" stickyHeader>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Owner</TableHeader>
              <TableHeader>Rows</TableHeader>
              <TableHeader>Last Modified</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {datasets.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  <span
                    className="mizu-body--sm"
                    style={{ fontFamily: 'var(--mizu-font-family-mono)' }}
                  >
                    {d.name}
                  </span>
                </TableCell>
                <TableCell>{d.owner}</TableCell>
                <TableCell>{formatCompact(d.rows)}</TableCell>
                <TableCell>{d.lastModified}</TableCell>
                <TableCell>
                  <Badge tone={STATUS_TONE[d.status]} dot>
                    {d.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AppContent>
    </AppLayout>
  );
}

const meta = {
  title: 'Demos/Analytics',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Workspace: Story = {
  render: () => <AnalyticsWorkspace />,
};
