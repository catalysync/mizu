import type { Config, ImmutableTree, JsonGroup } from '@aspect/advanced-query-builder';
import { BasicConfig, MizuAdvancedQueryBuilder, Utils } from '@aspect/advanced-query-builder';
import type { RuleGroupType } from '@aspect/query-builder';
import { MizuQueryBuilder, formatQuery } from '@aspect/query-builder';
import type { PropertyFilterProperty, PropertyFilterQuery } from '@aspect/react';
import { Card, FilterBar, PropertyFilter, Separator, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

// Shared field definitions
const properties: PropertyFilterProperty[] = [
  {
    key: 'status',
    label: 'Status',
    operators: ['=', '!='],
    options: ['running', 'idle', 'crashed'],
  },
  {
    key: 'region',
    label: 'Region',
    operators: ['=', '!='],
    options: ['us-east', 'us-west', 'eu-west'],
  },
  { key: 'framework', label: 'Framework', operators: ['=', 'contains'] },
];

const rqbFields = [
  { name: 'status', label: 'Status' },
  { name: 'region', label: 'Region' },
  { name: 'framework', label: 'Framework' },
];

const raqbConfig: Config = {
  ...BasicConfig,
  fields: {
    status: {
      label: 'Status',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: [
          { value: 'running', title: 'Running' },
          { value: 'idle', title: 'Idle' },
          { value: 'crashed', title: 'Crashed' },
        ],
      },
    },
    region: {
      label: 'Region',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: [
          { value: 'us-east', title: 'US East' },
          { value: 'us-west', title: 'US West' },
          { value: 'eu-west', title: 'EU West' },
        ],
      },
    },
    framework: { label: 'Framework', type: 'text', valueSources: ['value'] },
  },
};

const raqbInitial: JsonGroup = { id: '1', type: 'group', children1: [] };

function FilterComparisonDemo() {
  // 1. FilterBar state
  const [search, setSearch] = React.useState('');
  const [filters, setFilters] = React.useState([
    { key: 'status', label: 'Status', value: 'running' },
  ]);

  // 2. PropertyFilter state
  const [pfQuery, setPfQuery] = React.useState<PropertyFilterQuery>({
    operation: 'and',
    tokens: [{ propertyKey: 'status', operator: '=', value: 'running' }],
  });

  // 3. QueryBuilder state
  const [rqbQuery, setRqbQuery] = React.useState<RuleGroupType>({
    combinator: 'and',
    rules: [{ field: 'status', operator: '=', value: 'running' }],
  });

  // 4. Advanced Query Builder state
  const [raqbOutput, setRaqbOutput] = React.useState('');

  return (
    <Stack gap="2rem">
      <div>
        <h3 className="mizu-heading-sm" style={{ marginBottom: '0.5rem' }}>
          1. FilterBar
        </h3>
        <p className="mizu-caption" style={{ marginBottom: '0.75rem' }}>
          Simple search + applied filter pills. Best for basic table filtering.
        </p>
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          appliedFilters={filters}
          onRemoveFilter={(key) => setFilters((f) => f.filter((x) => x.key !== key))}
          onClearAll={() => setFilters([])}
          placeholder="Search apps…"
        />
      </div>

      <Separator />

      <div>
        <h3 className="mizu-heading-sm" style={{ marginBottom: '0.5rem' }}>
          2. PropertyFilter
        </h3>
        <p className="mizu-caption" style={{ marginBottom: '0.75rem' }}>
          Structured property:value input with autocomplete. Best for typed queries on known fields.
        </p>
        <PropertyFilter
          query={pfQuery}
          onQueryChange={setPfQuery}
          properties={properties}
          countText={`${pfQuery.tokens.length} active`}
        />
      </div>

      <Separator />

      <div>
        <h3 className="mizu-heading-sm" style={{ marginBottom: '0.5rem' }}>
          3. QueryBuilder
        </h3>
        <p className="mizu-caption" style={{ marginBottom: '0.75rem' }}>
          Visual rule builder with combinators. Best for user-constructed queries that export to
          SQL/JSON.
        </p>
        <MizuQueryBuilder fields={rqbFields} query={rqbQuery} onQueryChange={setRqbQuery} />
        <Card style={{ marginTop: '0.5rem' }}>
          <pre style={{ margin: 0, fontSize: '0.75rem' }}>{formatQuery(rqbQuery, 'sql')}</pre>
        </Card>
      </div>

      <Separator />

      <div>
        <h3 className="mizu-heading-sm" style={{ marginBottom: '0.5rem' }}>
          4. AdvancedQueryBuilder
        </h3>
        <p className="mizu-caption" style={{ marginBottom: '0.75rem' }}>
          Full-featured query builder with typed widgets per field. Best for complex reporting and
          analytics.
        </p>
        <MizuAdvancedQueryBuilder
          config={raqbConfig}
          value={raqbInitial}
          onChange={(tree: ImmutableTree, cfg: Config) => {
            const jsonLogic = Utils.jsonLogicFormat(tree, cfg);
            setRaqbOutput(JSON.stringify(jsonLogic, null, 2));
          }}
        />
        {raqbOutput && (
          <Card style={{ marginTop: '0.5rem' }}>
            <pre style={{ margin: 0, fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
              {raqbOutput}
            </pre>
          </Card>
        )}
      </div>
    </Stack>
  );
}

const meta = {
  title: 'Patterns/Filter Comparison',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllFourOptions: Story = {
  render: () => <FilterComparisonDemo />,
};
