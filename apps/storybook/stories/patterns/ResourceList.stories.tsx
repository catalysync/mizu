import {
  AppContentHeader,
  Badge,
  Button,
  Card,
  Inline,
  Input,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const items = [
  { name: 'frosty-mountain-1234', status: 'running', region: 'us-east', deploys: 142 },
  { name: 'calm-river-5678', status: 'idle', region: 'eu-west', deploys: 87 },
  { name: 'silent-pine-9012', status: 'building', region: 'us-west', deploys: 23 },
  { name: 'amber-cloud-3456', status: 'crashed', region: 'ap-south', deploys: 5 },
  { name: 'wild-sun-7890', status: 'idle', region: 'us-east', deploys: 0 },
];

const tone = (s: string) =>
  s === 'running'
    ? ('success' as const)
    : s === 'building'
      ? ('info' as const)
      : s === 'crashed'
        ? ('danger' as const)
        : ('neutral' as const);

const meta = {
  title: 'Patterns/Resource List',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Stack gap="1rem">
      <AppContentHeader
        title="Apps"
        description="5 applications"
        actions={
          <Button size="sm" variant="primary">
            New app
          </Button>
        }
      />
      <Inline gap="0.5rem">
        <Input size="sm" placeholder="Search apps…" aria-label="Search" className="story-md" />
        <Button size="sm" variant="secondary">
          Filters
        </Button>
      </Inline>
      <Inline gap="0.25rem">
        <Badge tone="neutral">All (5)</Badge>
        <Badge tone="success">Running (1)</Badge>
        <Badge tone="danger">Crashed (1)</Badge>
      </Inline>
      <Card>
        <Table density="compact">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Region</TableHeader>
              <TableHeader>Deploys</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((r) => (
              <TableRow key={r.name}>
                <TableCell>
                  <span className="mizu-mono">{r.name}</span>
                </TableCell>
                <TableCell>
                  <Badge tone={tone(r.status)} dot>
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell>{r.region}</TableCell>
                <TableCell>{r.deploys}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Pagination label="Showing 1–5 of 5" hasPrevious={false} hasNext={false} />
    </Stack>
  ),
};
