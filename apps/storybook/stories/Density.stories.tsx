import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Inline,
  Input,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

function DensitySample() {
  return (
    <Stack gap="1.5rem">
      <Inline gap="0.5rem" align="center">
        <Button variant="primary" size="sm">
          Save
        </Button>
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Badge tone="success" dot>
          Active
        </Badge>
        <Badge tone="danger">Failed</Badge>
      </Inline>
      <Input placeholder="Search…" aria-label="Search" />
      <Card>
        <CardHeader title="Recent deploys" description="Last 3 deployments." />
        <CardBody>
          <Table>
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
                  <Badge tone="neutral">idle</Badge>
                </TableCell>
                <TableCell>eu-west</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
        <CardFooter>
          <Button size="sm" variant="ghost">
            View all
          </Button>
        </CardFooter>
      </Card>
    </Stack>
  );
}

const meta = {
  title: 'Foundations/Density',
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div>
      <DensitySample />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div data-mizu-density="compact">
      <DensitySample />
    </div>
  ),
};

export const Comfortable: Story = {
  render: () => (
    <div data-mizu-density="comfortable">
      <DensitySample />
    </div>
  ),
};

export const DarkDefault: Story = {
  name: 'Dark — Default',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div data-theme="dark" className="story-dark-wrapper">
      <DensitySample />
    </div>
  ),
};

export const DarkCompact: Story = {
  name: 'Dark — Compact',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div data-theme="dark" data-mizu-density="compact" className="story-dark-wrapper">
      <DensitySample />
    </div>
  ),
};

export const DarkComfortable: Story = {
  name: 'Dark — Comfortable',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div data-theme="dark" data-mizu-density="comfortable" className="story-dark-wrapper">
      <DensitySample />
    </div>
  ),
};
