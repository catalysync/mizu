import type { Meta, StoryObj } from '@storybook/react-vite';
import '@aspect/commerce/css';
import { Pagination } from '@aspect/commerce';

const meta = {
  title: 'Commerce/Pagination',
  component: Pagination,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Showing 1–50 of 243 products',
    hasPrevious: false,
    hasNext: true,
  },
};

export const MiddlePage: Story = {
  args: {
    label: 'Showing 51–100 of 243 products',
    hasPrevious: true,
    hasNext: true,
  },
};

export const LastPage: Story = {
  args: {
    label: 'Showing 201–243 of 243 products',
    hasPrevious: true,
    hasNext: false,
  },
};

export const NoLabel: Story = {
  args: { hasPrevious: true, hasNext: true },
};
