import {
  Badge,
  Card,
  CardBody,
  DataCollection,
  DataTable,
  type DataTableColumn,
  EmptyState,
  Grid,
  Heading,
  Inline,
  Input,
  Pagination,
  Skeleton,
  Stack,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'churned';
  mrr: number;
}

const CUSTOMERS: Customer[] = [
  { id: '1', name: 'Acme Corp', email: 'ops@acme.com', status: 'active', mrr: 2400 },
  { id: '2', name: 'Globex', email: 'billing@globex.com', status: 'active', mrr: 1800 },
  { id: '3', name: 'Initech', email: 'admin@initech.com', status: 'churned', mrr: 0 },
  { id: '4', name: 'Umbrella Co', email: 'ops@umbrella.co', status: 'active', mrr: 3200 },
  { id: '5', name: 'Soylent', email: 'contact@soylent.com', status: 'active', mrr: 1100 },
];

const COLUMNS: DataTableColumn<Customer>[] = [
  { id: 'name', header: 'Name', cell: (row) => row.name },
  { id: 'email', header: 'Email', cell: (row) => row.email },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => (
      <Badge tone={row.status === 'active' ? 'success' : 'neutral'}>{row.status}</Badge>
    ),
  },
  {
    id: 'mrr',
    header: 'MRR',
    align: 'end',
    cell: (row) => `$${row.mrr.toLocaleString()}`,
  },
];

const meta = {
  title: 'Patterns/DataCollection',
  component: DataCollection,
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DataCollection<Customer>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeViews: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const filtered = CUSTOMERS.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
      <DataCollection
        data={paged}
        getRowId={(c) => c.id}
        toolbar={<Badge tone="neutral">{filtered.length} customers</Badge>}
        search={
          <Input
            placeholder="Search customers…"
            value={query}
            onChange={(e) => {
              setQuery(e.currentTarget.value);
              setPage(1);
            }}
          />
        }
        pagination={
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            hasPrevious={page > 1}
            hasNext={page < totalPages}
          />
        }
        emptyState={
          <EmptyState title="No customers match" description="Try a different search term." />
        }
        renderTable={(data) => <DataTable columns={COLUMNS} data={data} getRowId={(c) => c.id} />}
        renderGrid={(data) => (
          <Grid columns={3} gap="1rem">
            {data.map((c) => (
              <Card key={c.id}>
                <CardBody>
                  <Stack gap="0.5rem">
                    <Inline justify="between" align="center">
                      <Heading level={3} size="sm">
                        {c.name}
                      </Heading>
                      <Badge tone={c.status === 'active' ? 'success' : 'neutral'}>{c.status}</Badge>
                    </Inline>
                    <p style={{ margin: 0, color: 'var(--mizu-text-secondary)' }}>{c.email}</p>
                    <p style={{ margin: 0, fontWeight: 600 }}>${c.mrr.toLocaleString()}/mo</p>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
        renderList={(data) => (
          <Stack gap="0.5rem">
            {data.map((c) => (
              <Card key={c.id}>
                <CardBody>
                  <Inline justify="between" align="center">
                    <Stack gap="0.25rem">
                      <strong>{c.name}</strong>
                      <span style={{ color: 'var(--mizu-text-secondary)', fontSize: 14 }}>
                        {c.email}
                      </span>
                    </Stack>
                    <Inline gap="1rem" align="center">
                      <Badge tone={c.status === 'active' ? 'success' : 'neutral'}>{c.status}</Badge>
                      <strong>${c.mrr.toLocaleString()}</strong>
                    </Inline>
                  </Inline>
                </CardBody>
              </Card>
            ))}
          </Stack>
        )}
      />
    );
  },
};

export const Loading: Story = {
  render: () => (
    <DataCollection
      data={[]}
      loading
      loadingFallback={
        <Stack gap="0.5rem">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} variant="text" width="100%" />
          ))}
        </Stack>
      }
      renderTable={() => null}
      search={<Input placeholder="Search…" disabled />}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <DataCollection
      data={[]}
      getRowId={(c: Customer) => c.id}
      emptyState={
        <EmptyState
          title="No customers yet"
          description="Invite your first customer to get started."
        />
      }
      search={<Input placeholder="Search…" />}
      renderTable={(data) => <DataTable columns={COLUMNS} data={data} getRowId={(c) => c.id} />}
      renderGrid={() => null}
    />
  ),
};
