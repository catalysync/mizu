import { formatCompact } from '@aspect/finance';
import {
  AppBreadcrumbs,
  AppContent,
  AppContentHeader,
  AppHeader,
  AppLayout,
  AppSidebar,
  AppSidebarItem,
  AppSidebarSection,
  Badge,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { datasets, pipelines, workspace, type WorkspaceItem } from './data';

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

const PIPELINE_TONE = {
  success: 'success' as const,
  running: 'info' as const,
  failed: 'danger' as const,
  queued: 'neutral' as const,
};

function PipelinesPage() {
  return (
    <AppLayout
      style={{ minHeight: '720px' }}
      data-mizu-theme="analytics"
      data-mizu-density="compact"
    >
      <AppHeader
        brand={<>aspect analytics</>}
        actions={<Input size="sm" placeholder="Search pipelines…" aria-label="Search" />}
      />
      <AppSidebar ariaLabel="Workspace">
        <AppSidebarSection label="Workspace">
          {workspace.map((item) => (
            <TreeItem key={item.id} item={item} />
          ))}
        </AppSidebarSection>
      </AppSidebar>
      <AppContent contentType="table">
        <AppBreadcrumbs items={[{ label: 'Workspace', href: '#' }, { label: 'Pipelines' }]} />
        <AppContentHeader
          title="Pipelines"
          description={`${pipelines.length} pipelines · ${pipelines.filter((p) => p.status === 'running').length} running`}
          actions={
            <Button size="sm" variant="primary">
              New pipeline
            </Button>
          }
        />
        <Table density="compact" stickyHeader>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Owner</TableHeader>
              <TableHeader>Schedule</TableHeader>
              <TableHeader>Last Run</TableHeader>
              <TableHeader>Duration</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {pipelines.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <span
                    style={{ fontFamily: 'var(--mizu-font-family-mono)' }}
                    className="mizu-body--sm"
                  >
                    {p.name}
                  </span>
                </TableCell>
                <TableCell>{p.owner}</TableCell>
                <TableCell>{p.schedule}</TableCell>
                <TableCell>{p.lastRun}</TableCell>
                <TableCell>{p.duration}</TableCell>
                <TableCell>
                  <Badge tone={PIPELINE_TONE[p.status]} dot>
                    {p.status}
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

export const Pipelines: Story = {
  render: () => <PipelinesPage />,
};
