import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Badge,
} from '@aspect/react';

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
];

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
            <TableCell>{r.name}</TableCell>
            <TableCell>
              <Badge
                tone={
                  r.status === 'running' ? 'success' : r.status === 'building' ? 'info' : 'neutral'
                }
              >
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
