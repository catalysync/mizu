import { Breadcrumb, BreadcrumbCurrent, BreadcrumbLink } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
      <BreadcrumbLink href="#">Products</BreadcrumbLink>
      <BreadcrumbCurrent>Widget Pro</BreadcrumbCurrent>
    </Breadcrumb>
  ),
};

export const TwoLevels: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
      <BreadcrumbCurrent>Settings</BreadcrumbCurrent>
    </Breadcrumb>
  ),
};

export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb separator="›">
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
      <BreadcrumbLink href="#">Docs</BreadcrumbLink>
      <BreadcrumbLink href="#">Components</BreadcrumbLink>
      <BreadcrumbCurrent>Breadcrumb</BreadcrumbCurrent>
    </Breadcrumb>
  ),
};
