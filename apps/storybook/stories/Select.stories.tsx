import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

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

export const Simple: Story = {
  render: () => (
    <div className="story-sm">
      <Select>
        <SelectTrigger aria-label="Framework">
          <SelectValue placeholder="Pick framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="remix">Remix</SelectItem>
          <SelectItem value="vite">Vite</SelectItem>
          <SelectItem value="astro">Astro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="story-sm">
      <Select disabled defaultValue="locked">
        <SelectTrigger aria-label="Tier">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="locked">Enterprise (locked)</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
