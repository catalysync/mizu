import { ResourceItem, Thumbnail } from '@aspect/commerce';
import '@aspect/commerce/css';
import { Badge, Button, Card, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const IMG = 'https://picsum.photos/seed/product/200';

const meta = {
  title: 'Commerce/ResourceItem',
  component: ResourceItem,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ResourceItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Minimal Desk Lamp',
    meta: 'LAMP-001 · $89.00 · 124 in stock',
  },
};

export const WithThumbnail: Story = {
  args: {
    media: <Thumbnail source={IMG} alt="Desk lamp" size="sm" />,
    name: 'Minimal Desk Lamp',
    meta: 'LAMP-001 · $89.00',
    actions: <Badge tone="success">Active</Badge>,
  },
};

export const WithActions: Story = {
  args: {
    media: <Thumbnail source={IMG} alt="Standing desk" size="sm" />,
    name: 'Oak Standing Desk',
    meta: 'DESK-042 · $749.00 · 18 in stock',
    actions: (
      <Button size="sm" variant="ghost">
        Edit
      </Button>
    ),
  },
};

export const ProductList: Story = {
  render: () => (
    <Card className="story-lg">
      <Stack gap="0">
        <ResourceItem
          media={<Thumbnail source="https://picsum.photos/seed/lamp/200" alt="Lamp" size="sm" />}
          name="Minimal Desk Lamp"
          meta="LAMP-001 · $89.00 · 124 in stock"
          actions={<Badge tone="success">Active</Badge>}
        />
        <ResourceItem
          media={<Thumbnail source="https://picsum.photos/seed/desk/200" alt="Desk" size="sm" />}
          name="Oak Standing Desk"
          meta="DESK-042 · $749.00 · 18 in stock"
          actions={<Badge tone="success">Active</Badge>}
        />
        <ResourceItem
          media={<Thumbnail source="https://picsum.photos/seed/mug/200" alt="Mug" size="sm" />}
          name="Ceramic Mug Set (4)"
          meta="MUG-012 · $34.00 · Out of stock"
          actions={<Badge tone="danger">Draft</Badge>}
        />
        <ResourceItem
          media={
            <Thumbnail source="https://picsum.photos/seed/blanket/200" alt="Blanket" size="sm" />
          }
          name="Linen Throw Blanket"
          meta="BLKT-007 · $68.00 · 56 in stock"
          actions={<Badge tone="success">Active</Badge>}
        />
      </Stack>
    </Card>
  ),
};

export const OrderList: Story = {
  render: () => (
    <Card className="story-lg">
      <Stack gap="0">
        <ResourceItem
          name="Order #1042"
          meta="Sarah Chen · 3 items · $247.00 · Mar 28"
          actions={<Badge tone="success">Fulfilled</Badge>}
        />
        <ResourceItem
          name="Order #1041"
          meta="James Okafor · 1 item · $749.00 · Mar 27"
          actions={<Badge tone="warning">Pending</Badge>}
        />
        <ResourceItem
          name="Order #1040"
          meta="Priya Patel · 2 items · $157.00 · Mar 26"
          actions={<Badge tone="success">Fulfilled</Badge>}
        />
        <ResourceItem
          name="Order #1039"
          meta="Alex Kim · 1 item · $89.00 · Mar 25"
          actions={<Badge tone="danger">Refunded</Badge>}
        />
      </Stack>
    </Card>
  ),
};
