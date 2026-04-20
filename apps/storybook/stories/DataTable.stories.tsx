import { Badge, DataTable, Stack, type DataTableColumn } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  balance: number;
  status: 'active' | 'dormant' | 'lead';
}

const DATA: Customer[] = [
  { id: '1', name: 'Acme Holdings', email: 'ap@acme.com', balance: 12480, status: 'active' },
  { id: '2', name: 'Harbor & Co.', email: 'billing@harbor.co', balance: 4320, status: 'active' },
  { id: '3', name: 'Fleet Labs', email: 'accounts@fleet.io', balance: 0, status: 'active' },
  {
    id: '4',
    name: 'Tidewater Group',
    email: 'pay@tidewater.com',
    balance: 18700,
    status: 'active',
  },
  { id: '5', name: 'Kiln Studio', email: 'hello@kiln.work', balance: 850, status: 'active' },
  { id: '6', name: 'Magnolia Ltd', email: 'finance@magnolia.ltd', balance: 0, status: 'dormant' },
  {
    id: '7',
    name: 'Northlight Co-op',
    email: 'pay@northlight.coop',
    balance: 2200,
    status: 'active',
  },
  { id: '8', name: 'Perch Digital', email: 'ops@perch.com', balance: 0, status: 'lead' },
];

const COLUMNS: DataTableColumn<Customer>[] = [
  { id: 'name', header: 'Name', cell: (r) => r.name, sortable: true },
  { id: 'email', header: 'Email', cell: (r) => r.email },
  {
    id: 'balance',
    header: 'Balance',
    cell: (r) => `$${r.balance.toLocaleString()}`,
    align: 'end',
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    cell: (r) => (
      <Badge
        tone={r.status === 'active' ? 'success' : r.status === 'dormant' ? 'neutral' : 'warning'}
      >
        {r.status}
      </Badge>
    ),
  },
];

const meta = {
  title: 'Components/Atoms/DataTable',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DataTable columns={COLUMNS} data={DATA} getRowId={(r) => r.id} />,
};

export const Sortable: Story = {
  render: () => {
    const [sortCol, setSortCol] = useState<string | null>('balance');
    const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>('desc');
    const sorted = [...DATA].sort((a, b) => {
      if (!sortCol || !sortDir) return 0;
      const av = a[sortCol as keyof Customer];
      const bv = b[sortCol as keyof Customer];
      const cmp =
        typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return (
      <DataTable
        columns={COLUMNS}
        data={sorted}
        getRowId={(r) => r.id}
        sortColumn={sortCol}
        sortDirection={sortDir}
        onSort={(col, dir) => {
          setSortCol(col);
          setSortDir(dir);
        }}
      />
    );
  },
};

export const Selectable: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string>>(new Set(['1', '4']));
    return (
      <Stack gap="0.5rem">
        <DataTable
          columns={COLUMNS}
          data={DATA}
          getRowId={(r) => r.id}
          selectable
          selectedIds={selected}
          onSelectionChange={setSelected}
          caption="Customer list"
        />
        <p>{selected.size} selected</p>
      </Stack>
    );
  },
};

export const Expandable: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    return (
      <DataTable
        columns={COLUMNS}
        data={DATA}
        getRowId={(r) => r.id}
        expandable
        expandedIds={expanded}
        onExpandChange={setExpanded}
        renderExpanded={(r) => (
          <Stack gap="0.25rem">
            <strong>{r.name}</strong>
            <span>Email: {r.email}</span>
            <span>Balance: ${r.balance.toLocaleString()}</span>
          </Stack>
        )}
      />
    );
  },
};

export const Striped: Story = {
  render: () => <DataTable columns={COLUMNS} data={DATA} getRowId={(r) => r.id} striped />,
};

export const Compact: Story = {
  render: () => (
    <DataTable columns={COLUMNS} data={DATA} getRowId={(r) => r.id} density="compact" striped />
  ),
};

export const Loading: Story = {
  render: () => (
    <DataTable
      columns={COLUMNS}
      data={[]}
      getRowId={(r: Customer) => r.id}
      loading
      loadingRows={5}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <DataTable
      columns={COLUMNS}
      data={[]}
      getRowId={(r: Customer) => r.id}
      emptyMessage="No customers found. Try a different filter."
    />
  ),
};
