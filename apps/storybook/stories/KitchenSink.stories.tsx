import type { PropertyFilterProperty, PropertyFilterQuery } from '@aspect/react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  EmptyState,
  FilterBar,
  Grid,
  Inline,
  Input,
  PropertyFilter,
  RadioGroup,
  RadioItem,
  Select,
  Separator,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const properties: PropertyFilterProperty[] = [
  { key: 'status', label: 'Status', operators: ['=', '!='], options: ['running', 'idle'] },
  { key: 'region', label: 'Region', operators: ['='], options: ['us-east', 'eu-west'] },
];

function AllComponents() {
  const [pfQuery, setPfQuery] = React.useState<PropertyFilterQuery>({
    operation: 'and',
    tokens: [],
  });

  return (
    <Stack gap="2.5rem">
      <section>
        <h2 className="mizu-h3 story-section-title">Buttons</h2>
        <Stack gap="0.75rem">
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
        </Stack>
      </section>

      <Separator />

      <section>
        <h2 className="mizu-h3 story-section-title">Badges</h2>
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
        <h2 className="mizu-h3 story-section-title">Form Controls</h2>
        <Grid gap="1.25rem" min="14rem">
          <Input label="Text input" placeholder="Type something" />
          <Textarea label="Textarea" placeholder="Notes" rows={2} />
          <Select label="Select">
            <option value="">Choose…</option>
            <option value="a">Option A</option>
            <option value="b">Option B</option>
          </Select>
          <Stack gap="0.5rem">
            <span className="mizu-label">Checkboxes</span>
            <Checkbox label="Option one" defaultChecked />
            <Checkbox label="Option two" />
          </Stack>
          <RadioGroup label="Radio group">
            <RadioItem value="a" label="Choice A" />
            <RadioItem value="b" label="Choice B" />
          </RadioGroup>
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
        <h2 className="mizu-h3 story-section-title">Cards</h2>
        <Grid gap="1.25rem" min="16rem">
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
        <h2 className="mizu-h3 story-section-title">Table</h2>
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
            <TableRow>
              <TableCell>wild-sun</TableCell>
              <TableCell>
                <Badge tone="danger">crashed</Badge>
              </TableCell>
              <TableCell>ap-south</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <Separator />

      <section>
        <h2 className="mizu-h3 story-section-title">Tabs</h2>
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
        <h2 className="mizu-h3 story-section-title">Filtering</h2>
        <Stack gap="1rem">
          <FilterBar
            searchValue=""
            onSearchChange={() => {}}
            appliedFilters={[{ key: 'status', label: 'Status', value: 'running' }]}
            onRemoveFilter={() => {}}
            onClearAll={() => {}}
            placeholder="Search…"
          />
          <PropertyFilter
            query={pfQuery}
            onQueryChange={setPfQuery}
            properties={properties}
            placeholder="Filter by property…"
          />
        </Stack>
      </section>

      <Separator />

      <section>
        <h2 className="mizu-h3 story-section-title">Empty State</h2>
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
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div data-theme="dark" className="story-dark-wrapper">
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
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div data-theme="dark" data-mizu-density="compact" className="story-dark-wrapper">
      <AllComponents />
    </div>
  ),
};
