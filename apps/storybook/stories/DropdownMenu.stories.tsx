import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Overlays/DropdownMenu',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>App</DropdownMenuLabel>
        <DropdownMenuItem>Edit settings</DropdownMenuItem>
        <DropdownMenuItem>View logs</DropdownMenuItem>
        <DropdownMenuItem>Restart</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem danger>Delete app</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Simple: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Sort by</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Newest first</DropdownMenuItem>
        <DropdownMenuItem>Oldest first</DropdownMenuItem>
        <DropdownMenuItem>Alphabetical</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
