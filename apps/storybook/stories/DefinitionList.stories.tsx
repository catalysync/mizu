import { DefinitionList } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Atoms/DefinitionList',
  component: DefinitionList,
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: { control: { type: 'select' }, options: ['horizontal', 'vertical'] },
    columns: { control: { type: 'select' }, options: [1, 2, 3] },
  },
} satisfies Meta<typeof DefinitionList>;

export default meta;
type Story = StoryObj<typeof meta>;

const INVOICE_ITEMS = [
  { label: 'Invoice number', value: 'INV-2026-0412' },
  { label: 'Status', value: 'Paid' },
  { label: 'Issued', value: 'Apr 1, 2026' },
  { label: 'Due', value: 'Apr 15, 2026' },
  { label: 'Amount', value: '$12,480.00' },
];

export const Default: Story = {
  args: { items: INVOICE_ITEMS },
};

export const Vertical: Story = {
  args: { items: INVOICE_ITEMS, orientation: 'vertical' },
};

export const TwoColumns: Story = {
  args: { items: INVOICE_ITEMS, columns: 2 },
};

export const ThreeColumns: Story = {
  args: {
    items: [
      { label: 'Account', value: 'Acme Inc' },
      { label: 'Plan', value: 'Business' },
      { label: 'Seats', value: '12 / 25' },
      { label: 'Renews', value: '2027-04-01' },
      { label: 'Balance', value: '$0.00' },
      { label: 'Last invoice', value: 'INV-0412' },
    ],
    columns: 3,
  },
};

export const WithChildren: Story = {
  render: () => (
    <DefinitionList>
      <dt>Custom label</dt>
      <dd>Custom value</dd>
      <dt>Another</dt>
      <dd>Value</dd>
    </DefinitionList>
  ),
};
