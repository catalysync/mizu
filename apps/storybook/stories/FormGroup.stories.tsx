import { FormGroup } from '@aspect/commerce';
import '@aspect/commerce/css';
import { Input, Stack, Textarea } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Commerce/FormGroup',
  component: FormGroup,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof FormGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FormGroup label="Product name" htmlFor="fg-name" className="story-md">
      <Input id="fg-name" placeholder="Enter product name" />
    </FormGroup>
  ),
};

export const WithHelp: Story = {
  render: () => (
    <FormGroup
      label="SKU"
      htmlFor="fg-sku"
      help="Must be unique across your catalog."
      className="story-md"
    >
      <Input id="fg-sku" placeholder="e.g. LAMP-001" />
    </FormGroup>
  ),
};

export const WithError: Story = {
  render: () => (
    <FormGroup
      label="Price"
      htmlFor="fg-price"
      error="Price must be greater than 0."
      className="story-md"
    >
      <Input id="fg-price" type="number" defaultValue="0" />
    </FormGroup>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <FormGroup
      label="Description"
      htmlFor="fg-desc"
      help="Shown on the product page."
      className="story-md"
    >
      <Textarea id="fg-desc" placeholder="Describe your product" rows={3} />
    </FormGroup>
  ),
};

export const FullForm: Story = {
  render: () => (
    <Stack gap="1rem" className="story-md">
      <FormGroup label="Product name" htmlFor="ff-name">
        <Input id="ff-name" defaultValue="Minimal Desk Lamp" />
      </FormGroup>
      <FormGroup label="SKU" htmlFor="ff-sku">
        <Input id="ff-sku" defaultValue="LAMP-001" />
      </FormGroup>
      <FormGroup label="Price" htmlFor="ff-price">
        <Input id="ff-price" type="number" defaultValue="89" />
      </FormGroup>
      <FormGroup label="Description" htmlFor="ff-desc" help="Max 500 characters.">
        <Textarea id="ff-desc" defaultValue="A beautiful desk lamp." rows={3} />
      </FormGroup>
    </Stack>
  ),
};
