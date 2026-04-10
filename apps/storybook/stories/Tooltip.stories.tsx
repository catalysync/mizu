import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
  Inline,
} from '@aspect/react';

const meta = {
  title: 'Components/Overlays/Tooltip',
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={200}>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>This is a tooltip</TooltipContent>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: () => (
    <Inline gap="1rem">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="ghost">{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>{side} tooltip</TooltipContent>
        </Tooltip>
      ))}
    </Inline>
  ),
};
