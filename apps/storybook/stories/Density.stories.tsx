import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Stack,
  Inline,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@aspect/react';

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
