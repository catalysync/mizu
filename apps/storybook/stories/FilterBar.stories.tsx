import { Button, FilterBar } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Data Display/FilterBar',
  tags: ['autodocs', 'experimental'],
  component: FilterBar,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchPlaceholder: 'Search products…',
  },
};

export const WithFilters: Story = {
  args: {
    searchValue: 'lamp',
    appliedFilters: [
      { key: 'status', label: 'Status', value: 'Active' },
      { key: 'category', label: 'Category', value: 'Lighting' },
    ],
    onRemoveFilter: () => {},
    onClearAll: () => {},
  },
};

export const WithActions: Story = {
  args: {
    searchPlaceholder: 'Search apps…',
    appliedFilters: [{ key: 'region', label: 'Region', value: 'US East' }],
    onRemoveFilter: () => {},
    actions: (
      <Button size="sm" variant="secondary">
        Add filter
      </Button>
    ),
  },
};

export const Empty: Story = {
  args: {
    searchPlaceholder: 'Search orders…',
    appliedFilters: [],
  },
};

export const ManyFilters: Story = {
  args: {
    appliedFilters: [
      { key: 'status', label: 'Status', value: 'Active' },
      { key: 'region', label: 'Region', value: 'US East' },
      { key: 'type', label: 'Type', value: 'Web App' },
      { key: 'framework', label: 'Framework', value: 'Next.js' },
      { key: 'team', label: 'Team', value: 'Platform' },
    ],
    onRemoveFilter: () => {},
    onClearAll: () => {},
  },
};
