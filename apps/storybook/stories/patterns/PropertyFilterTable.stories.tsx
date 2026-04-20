import type { PropertyFilterProperty, PropertyFilterQuery } from '@aspect/react';
import {
  Badge,
  Card,
  EmptyState,
  PropertyFilter,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

interface AppRecord {
  id: string;
  name: string;
  status: string;
  region: string;
  framework: string;
  deploys: number;
  lastDeployed: string;
}

const properties: PropertyFilterProperty[] = [
  {
    key: 'status',
    label: 'Status',
    operators: ['=', '!='],
    options: ['running', 'idle', 'crashed', 'building'],
  },
  {
    key: 'region',
    label: 'Region',
    operators: ['=', '!='],
    options: ['us-east', 'us-west', 'eu-west', 'ap-south'],
  },
  { key: 'framework', label: 'Framework', operators: ['=', 'contains'] },
  { key: 'deploys', label: 'Deploys', operators: ['=', '>', '<', '>=', '<='] },
];

const statusTone: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  running: 'success',
  idle: 'warning',
  crashed: 'danger',
  building: 'info',
};

function toWhereClause(query: PropertyFilterQuery): string {
  if (query.tokens.length === 0) return '';
  const clauses = query.tokens.map((t) => {
    if (t.operator === 'contains') return `${t.propertyKey} like '%${t.value}%'`;
    if (t.operator === 'startsWith') return `${t.propertyKey} like '${t.value}%'`;
    return `${t.propertyKey} ${t.operator} '${t.value}'`;
  });
  return clauses.join(` ${query.operation} `);
}

function PropertyFilterTableDemo() {
  const [query, setQuery] = React.useState<PropertyFilterQuery>({
    operation: 'and',
    tokens: [],
  });
  const [results, setResults] = React.useState<AppRecord[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async (q: PropertyFilterQuery) => {
    setLoading(true);
    try {
      const where = toWhereClause(q);
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ where: where || undefined }),
      });
      const json = await res.json();
      setResults(json.data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData(query);
  }, [query, fetchData]);

  return (
    <Stack gap="1rem">
      <PropertyFilter
        query={query}
        onQueryChange={setQuery}
        properties={properties}
        countText={loading ? 'Loading…' : `${results.length} matches`}
        placeholder="Filter by status, region, framework…"
      />
      <Card>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
              Loading…
            </span>
          </div>
        ) : results.length === 0 ? (
          <EmptyState heading="No matches" body="Try removing some filters." />
        ) : (
          <Table density="compact">
            <TableHead>
              <TableRow>
                <TableHeader>App</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Region</TableHeader>
                <TableHeader>Framework</TableHeader>
                <TableHeader>Deploys</TableHeader>
                <TableHeader>Last deployed</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>
                    <Badge tone={statusTone[app.status] ?? 'info'}>{app.status}</Badge>
                  </TableCell>
                  <TableCell>{app.region}</TableCell>
                  <TableCell>{app.framework}</TableCell>
                  <TableCell>{app.deploys}</TableCell>
                  <TableCell>
                    {new Date(app.lastDeployed).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </Stack>
  );
}

const meta = {
  title: 'Patterns/Property Filter Table',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <PropertyFilterTableDemo />,
};
