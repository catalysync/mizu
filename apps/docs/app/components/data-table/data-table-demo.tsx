'use client';

import { Badge, DataTable, type DataTableColumn, type SortDirection } from '@mizunagara/react';
import { useState } from 'react';

interface Deployment {
  id: string;
  service: string;
  region: string;
  requests: number;
  status: 'healthy' | 'degraded';
}

const ROWS: Deployment[] = [
  { id: 'a', service: 'api-gateway', region: 'us-east', requests: 18420, status: 'healthy' },
  { id: 'b', service: 'billing', region: 'eu-west', requests: 2310, status: 'healthy' },
  { id: 'c', service: 'search', region: 'us-west', requests: 9120, status: 'degraded' },
  { id: 'd', service: 'uploads', region: 'eu-west', requests: 640, status: 'healthy' },
];

const COLUMNS: DataTableColumn<Deployment>[] = [
  { id: 'service', header: 'Service', cell: (r) => r.service, sortable: true },
  { id: 'region', header: 'Region', cell: (r) => r.region },
  {
    id: 'requests',
    header: 'Requests / min',
    cell: (r) => r.requests.toLocaleString(),
    align: 'end',
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    cell: (r) => <Badge tone={r.status === 'healthy' ? 'success' : 'warning'}>{r.status}</Badge>,
  },
];

export function DataTableDemo() {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const sorted = [...ROWS];
  if (sortColumn && sortDirection) {
    const key = sortColumn as keyof Deployment;
    sorted.sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }

  return (
    <DataTable
      columns={COLUMNS}
      data={sorted}
      getRowId={(r) => r.id}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={(column, direction) => {
        setSortColumn(column);
        setSortDirection(direction);
      }}
      selectable
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      labels={{ selectRow: (row) => `Select ${row.service}` }}
      caption="Deployments"
    />
  );
}
