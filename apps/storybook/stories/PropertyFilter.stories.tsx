import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import {
  PropertyFilter,
  type PropertyFilterQuery,
  type PropertyFilterProperty,
  Stack,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Badge,
} from '@aspect/react';

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

function PropertyFilterDemo() {
  const [query, setQuery] = React.useState<PropertyFilterQuery>({
    operation: 'and',
    tokens: [{ propertyKey: 'status', operator: '=', value: 'running' }],
  });

  return (
    <Stack gap="1rem">
      <PropertyFilter
        query={query}
        onQueryChange={setQuery}
        properties={properties}
        countText="3 matches"
        placeholder="Filter by status, region, framework…"
      />
      <Card>
        <Table density="compact">
          <TableHead>
            <TableRow>
              <TableHeader>App</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Region</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>frosty-mountain</TableCell>
              <TableCell>
                <Badge tone="success">running</Badge>
              </TableCell>
              <TableCell>us-east</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>calm-river</TableCell>
              <TableCell>
                <Badge tone="success">running</Badge>
              </TableCell>
              <TableCell>eu-west</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>wild-sun</TableCell>
              <TableCell>
                <Badge tone="success">running</Badge>
              </TableCell>
              <TableCell>us-east</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Stack>
  );
}

const meta = {
  title: 'Components/Data Display/PropertyFilter',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <PropertyFilterDemo />,
};
