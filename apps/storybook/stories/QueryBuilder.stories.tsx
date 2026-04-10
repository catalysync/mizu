import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { MizuQueryBuilder, formatQuery } from '@aspect/query-builder';
import type { RuleGroupType } from '@aspect/query-builder';
import { Stack, Card } from '@aspect/react';

const fields = [
  { name: 'status', label: 'Status' },
  { name: 'region', label: 'Region' },
  { name: 'framework', label: 'Framework' },
  { name: 'deploys', label: 'Deploys', inputType: 'number' as const },
  { name: 'createdAt', label: 'Created At', inputType: 'date' as const },
];

function QueryBuilderDemo() {
  const [query, setQuery] = React.useState<RuleGroupType>({
    combinator: 'and',
    rules: [
      { field: 'status', operator: '=', value: 'running' },
      { field: 'region', operator: '=', value: 'us-east' },
    ],
  });

  return (
    <Stack gap="1rem">
      <MizuQueryBuilder fields={fields} query={query} onQueryChange={setQuery} />
      <Card>
        <pre style={{ margin: 0, fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}>
          {formatQuery(query, 'sql')}
        </pre>
      </Card>
    </Stack>
  );
}

function QueryBuilderEmptyDemo() {
  const [query, setQuery] = React.useState<RuleGroupType>({
    combinator: 'and',
    rules: [],
  });

  return (
    <Stack gap="1rem">
      <MizuQueryBuilder fields={fields} query={query} onQueryChange={setQuery} />
      <Card>
        <pre style={{ margin: 0, fontSize: '0.8125rem' }}>{formatQuery(query, 'json')}</pre>
      </Card>
    </Stack>
  );
}

const meta = {
  title: 'Components/Data Display/QueryBuilder',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <QueryBuilderDemo />,
};

export const Empty: Story = {
  render: () => <QueryBuilderEmptyDemo />,
};
