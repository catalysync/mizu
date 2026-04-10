import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Textarea,
  Switch,
  Separator,
  EmptyState,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Stack,
  Inline,
  Grid,
} from '@aspect/react';

function AllComponents() {
  return (
    <Stack gap="2rem">
      <section>
        <h2 className="mizu-h3">Buttons</h2>
        <Inline gap="0.5rem" align="center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </Inline>
        <Inline gap="0.5rem" align="center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Inline>
      </section>

      <Separator />

      <section>
        <h2 className="mizu-h3">Badges</h2>
        <Inline gap="0.5rem">
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="success" dot>
            Success
          </Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="info">Info</Badge>
        </Inline>
      </section>

      <Separator />

      <section>
        <h2 className="mizu-h3">Form Controls</h2>
        <Grid gap="1rem" min="14rem">
          <Input placeholder="Text input" aria-label="Text" />
          <Textarea placeholder="Textarea" aria-label="Notes" rows={2} />
          <Inline gap="0.5rem" align="center">
            <Switch id="ks-switch" aria-label="Toggle" />
            <label htmlFor="ks-switch" className="mizu-body--sm">
              Toggle switch
            </label>
          </Inline>
        </Grid>
      </section>

      <Separator />

      <section>
        <h2 className="mizu-h3">Card</h2>
        <Grid gap="1rem" min="16rem">
          <Card>
            <CardHeader title="Default card" description="With header and body." />
            <CardBody>
              <p className="mizu-body--sm">Content goes here.</p>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="ghost">
                Action
              </Button>
            </CardFooter>
          </Card>
          <Card interactive>
            <CardHeader title="Interactive card" description="Hover to see effect." />
            <CardBody>
              <p className="mizu-body--sm">Clickable.</p>
            </CardBody>
          </Card>
        </Grid>
      </section>

      <Separator />

      <section>
        <h2 className="mizu-h3">Table</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
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
            <TableRow selected>
              <TableCell>calm-river</TableCell>
              <TableCell>
                <Badge tone="neutral">idle</Badge>
              </TableCell>
              <TableCell>eu-west</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <Separator />

      <section>
        <h2 className="mizu-h3">Tabs</h2>
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">Tab One</TabsTrigger>
            <TabsTrigger value="two">Tab Two</TabsTrigger>
            <TabsTrigger value="three">Tab Three</TabsTrigger>
          </TabsList>
          <TabsContent value="one">First tab content.</TabsContent>
          <TabsContent value="two">Second tab content.</TabsContent>
          <TabsContent value="three">Third tab content.</TabsContent>
        </Tabs>
      </section>

      <Separator />

      <section>
        <h2 className="mizu-h3">Empty State</h2>
        <EmptyState
          title="No results"
          description="Try adjusting your search or filters."
          actions={<Button variant="primary">Clear filters</Button>}
        />
      </section>
    </Stack>
  );
}

const meta = {
  title: 'Foundations/Kitchen Sink',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  render: () => <AllComponents />,
};

export const Dark: Story = {
  render: () => (
    <div
      data-theme="dark"
      style={{
        background: 'var(--mizu-surface-default)',
        padding: '2rem',
        borderRadius: 'var(--mizu-radius-lg)',
      }}
    >
      <AllComponents />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div data-mizu-density="compact">
      <AllComponents />
    </div>
  ),
};

export const DarkCompact: Story = {
  name: 'Dark + Compact',
  render: () => (
    <div
      data-theme="dark"
      data-mizu-density="compact"
      style={{
        background: 'var(--mizu-surface-default)',
        padding: '2rem',
        borderRadius: 'var(--mizu-radius-lg)',
      }}
    >
      <AllComponents />
    </div>
  ),
};
