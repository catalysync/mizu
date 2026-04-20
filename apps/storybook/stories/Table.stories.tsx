import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Data Display/Table',
  component: Table,
  parameters: { layout: 'padded' },
  argTypes: {
    density: { control: 'select', options: ['compact', 'default', 'comfortable'] },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { name: 'frosty-mountain', status: 'running', region: 'us-east', deploys: 142 },
  { name: 'calm-river', status: 'idle', region: 'eu-west', deploys: 87 },
  { name: 'silent-pine', status: 'building', region: 'us-west', deploys: 23 },
  { name: 'amber-cloud', status: 'crashed', region: 'ap-south', deploys: 5 },
];

const tone = (s: string) =>
  s === 'running'
    ? ('success' as const)
    : s === 'building'
      ? ('info' as const)
      : s === 'crashed'
        ? ('danger' as const)
        : ('neutral' as const);

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Region</TableHeader>
          <TableHeader>Deploys</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r) => (
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
  ),
};

export const Compact: Story = { ...Default, args: { density: 'compact' } };
export const Comfortable: Story = { ...Default, args: { density: 'comfortable' } };

export const WithSelection: Story = {
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow selected>
          <TableCell>frosty-mountain</TableCell>
          <TableCell>
            <Badge tone="success">running</Badge>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>calm-river</TableCell>
          <TableCell>
            <Badge tone="neutral">idle</Badge>
          </TableCell>
        </TableRow>
        <TableRow selected>
          <TableCell>silent-pine</TableCell>
          <TableCell>
            <Badge tone="info">building</Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Striped: Story = {
  render: () => (
    <table className="mizu-table mizu-table--striped" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Product</th>
          <th>SKU</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        {['Desk Lamp', 'Standing Desk', 'Mug Set', 'Throw Blanket', 'Monitor Riser'].map((p, i) => (
          <tr key={p}>
            <td>{p}</td>
            <td className="mizu-mono">SKU-{String(i + 1).padStart(3, '0')}</td>
            <td>{Math.floor(Math.random() * 100)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Bordered: Story = {
  render: () => (
    <table className="mizu-table mizu-table--bordered" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Revenue</td>
          <td>$482K</td>
        </tr>
        <tr>
          <td>Expenses</td>
          <td>$318K</td>
        </tr>
        <tr>
          <td>Net</td>
          <td>$164K</td>
        </tr>
      </tbody>
    </table>
  ),
};

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody />
    </Table>
  ),
};
