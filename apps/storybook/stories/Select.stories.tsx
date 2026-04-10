import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectGroup,
  SelectValue,
} from '@aspect/react';

const meta = {
  title: 'Components/Atoms/Select',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="story-sm">
      <Select>
        <SelectTrigger aria-label="Region">
          <SelectValue placeholder="Choose region" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Americas</SelectLabel>
            <SelectItem value="us-east">US East</SelectItem>
            <SelectItem value="us-west">US West</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="eu-west">EU West</SelectItem>
            <SelectItem value="eu-central">EU Central</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};
