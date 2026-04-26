import type { RuleGroupType } from '@aspect/query-builder';
import { MizuQueryBuilder, formatQuery } from '@aspect/query-builder';
import {
  Badge,
  Button,
  Card,
  EmptyState,
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

const fields = [
  {
    name: 'status',
    label: 'Status',
    valueEditorType: 'select' as const,
    values: [
      { name: 'running', label: 'Running' },
      { name: 'idle', label: 'Idle' },
      { name: 'crashed', label: 'Crashed' },
      { name: 'building', label: 'Building' },
    ],
  },
  {
    name: 'region',
    label: 'Region',
    valueEditorType: 'select' as const,
    values: [
      { name: 'us-east', label: 'US East' },
      { name: 'us-west', label: 'US West' },
      { name: 'eu-west', label: 'EU West' },
      { name: 'ap-south', label: 'AP South' },
    ],
  },
  { name: 'framework', label: 'Framework' },
  { name: 'deploys', label: 'Deploys', inputType: 'number' as const },
];

const statusTone: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  running: 'success',
  idle: 'warning',
  crashed: 'danger',
  building: 'info',
};

function QueryToTableDemo() {
  const [query, setQuery] = React.useState<RuleGroupType>({
    combinator: 'and',
    rules: [{ field: 'status', operator: '=', value: 'running' }],
  });
  const [results, setResults] = React.useState<AppRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [hasQueried, setHasQueried] = React.useState(false);

  const runQuery = React.useCallback(async () => {
    setLoading(true);
    setHasQueried(true);
    try {
      const where = formatQuery(query, 'sql');
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ where }),
      });
      const json = await res.json();
      setResults(json.data);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Run initial query on mount
  React.useEffect(() => {
    runQuery();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Stack gap="1rem">
      <Card>
        <Stack gap="0.75rem">
          <MizuQueryBuilder fields={fields} query={query} onQueryChange={setQuery} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Button onClick={runQuery} loading={loading}>
              Run query
            </Button>
            <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
              {hasQueried &&
                !loading &&
                `${results.length} result${results.length !== 1 ? 's' : ''}`}
            </span>
          </div>
          <pre className="mizu-caption" style={{ margin: 0, color: 'var(--mizu-text-tertiary)' }}>
            WHERE {formatQuery(query, 'sql')}
          </pre>
        </Stack>
      </Card>

      <Card>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
              Loading…
            </span>
          </div>
        ) : results.length === 0 && hasQueried ? (
          <EmptyState heading="No results" body="Try adjusting your query to match more records." />
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
  title: 'Patterns/Query to Table',
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <QueryToTableDemo />,
};
