import type { Meta, StoryObj } from '@storybook/react-vite';
import '@aspect/commerce/css';
import { Thumbnail } from '@aspect/commerce';
import { Inline } from '@aspect/react';

const IMG = 'https://picsum.photos/seed/mizu/200';

const meta = {
  title: 'Commerce/Thumbnail',
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
