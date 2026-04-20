import { Pagination, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Components/Atoms/Pagination',
  component: Pagination,
  parameters: { layout: 'padded' },
  argTypes: {
    page: { control: { type: 'number', min: 1, step: 1 } },
    totalPages: { control: { type: 'number', min: 1, step: 1 } },
    hasPrevious: { control: 'boolean' },
    hasNext: { control: 'boolean' },
  },
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

export const WithPageNumbers: Story = {
  args: { page: 4, totalPages: 10, label: '31–40 of 100' },
};

export const Collapsed: Story = {
  args: { page: 12, totalPages: 40, label: '111–120 of 400' },
};

export const Controlled: Story = {
  render: () => {
    const [page, setPage] = useState(3);
    return (
      <Stack gap="0.5rem">
        <Pagination page={page} totalPages={10} onPageChange={setPage} />
        <p>Current page: {page}</p>
      </Stack>
    );
  },
};
