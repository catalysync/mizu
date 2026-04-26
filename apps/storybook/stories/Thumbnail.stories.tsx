import { Thumbnail } from '@aspect/commerce';
import '@aspect/commerce/css';
import { Inline } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const IMG = 'https://picsum.photos/seed/mizu/200';

const meta = {
  title: 'Commerce/Thumbnail',
  tags: ['autodocs', 'experimental'],
  component: Thumbnail,
  parameters: { layout: 'centered' },
  args: { source: IMG, alt: 'Product image' },
} satisfies Meta<typeof Thumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ExtraSmall: Story = { args: { size: 'xs' } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };

export const AllSizes: Story = {
  render: () => (
    <Inline gap="0.75rem" align="center">
      <Thumbnail source={IMG} alt="XS" size="xs" />
      <Thumbnail source={IMG} alt="SM" size="sm" />
      <Thumbnail source={IMG} alt="MD" size="md" />
      <Thumbnail source={IMG} alt="LG" size="lg" />
    </Inline>
  ),
};
