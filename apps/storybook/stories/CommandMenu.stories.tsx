import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CommandMenu,
  CommandMenuInput,
  CommandMenuList,
  CommandMenuEmpty,
  CommandMenuGroup,
  CommandMenuItem,
  CommandMenuSeparator,
  Button,
} from '@aspect/react';

const meta = {
  title: 'Components/Overlays/CommandMenu',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open command menu (⌘K)</Button>
        <CommandMenu open={open} onOpenChange={setOpen}>
          <CommandMenuInput placeholder="Type a command or search..." />
          <CommandMenuList>
            <CommandMenuEmpty>No results found.</CommandMenuEmpty>
            <CommandMenuGroup heading="Actions">
              <CommandMenuItem onSelect={() => setOpen(false)}>New project</CommandMenuItem>
              <CommandMenuItem onSelect={() => setOpen(false)}>New deployment</CommandMenuItem>
              <CommandMenuItem onSelect={() => setOpen(false)}>New domain</CommandMenuItem>
            </CommandMenuGroup>
            <CommandMenuSeparator />
            <CommandMenuGroup heading="Navigation">
              <CommandMenuItem onSelect={() => setOpen(false)}>Dashboard</CommandMenuItem>
              <CommandMenuItem onSelect={() => setOpen(false)}>Settings</CommandMenuItem>
              <CommandMenuItem onSelect={() => setOpen(false)}>Team</CommandMenuItem>
            </CommandMenuGroup>
          </CommandMenuList>
        </CommandMenu>
      </>
    );
  },
};
