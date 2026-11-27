import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from '../components/AlertDialog';
import { Combobox } from '../components/Combobox';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../components/ContextMenu';
import { Drawer, DrawerContent, DrawerTitle } from '../components/Drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/DropdownMenu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../components/HoverCard';
import { Modal, ModalContent, ModalTitle } from '../components/Modal';
import { Popover, PopoverContent, PopoverTrigger } from '../components/Popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/Select';
import { Sheet, SheetContent, SheetTitle } from '../components/Sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/Tooltip';
import { copyPortalIdentity } from './Portal';

const IDENTITY_ATTRS = {
  'data-mizu-identity': 'sharp',
  'data-theme': 'dark',
  'data-mizu-density': 'compact',
} as const;

function Identity({
  attrs = IDENTITY_ATTRS,
  children,
}: {
  attrs?: Record<string, string>;
  children: React.ReactNode;
}) {
  return <div {...attrs}>{children}</div>;
}

// Each case renders an open overlay inside an identity wrapper and names the element Radix mounts under body.
const CASES: Array<[string, React.ReactElement, string]> = [
  [
    'Modal',
    <Modal key="m" open>
      <ModalContent>
        <ModalTitle>Title</ModalTitle>
      </ModalContent>
    </Modal>,
    '[data-component="mizu-modal"]',
  ],
  [
    'Sheet',
    <Sheet key="s" open>
      <SheetContent>
        <SheetTitle>Title</SheetTitle>
      </SheetContent>
    </Sheet>,
    '[data-component="mizu-sheet"]',
  ],
  [
    'Drawer',
    <Drawer key="d" open>
      <DrawerContent>
        <DrawerTitle>Title</DrawerTitle>
      </DrawerContent>
    </Drawer>,
    '[data-component="mizu-drawer"]',
  ],
  [
    'AlertDialog',
    <AlertDialog key="a" open>
      <AlertDialogContent>
        <AlertDialogTitle>Title</AlertDialogTitle>
      </AlertDialogContent>
    </AlertDialog>,
    '[data-component="mizu-alert-dialog"]',
  ],
  [
    'Popover',
    <Popover key="p" open>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Body</PopoverContent>
    </Popover>,
    '[data-component="mizu-popover"]',
  ],
  [
    'Tooltip',
    <TooltipProvider key="t">
      <Tooltip open>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent>Tip</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
    '[data-component="mizu-tooltip"]',
  ],
  [
    'HoverCard',
    <HoverCard key="h" open>
      <HoverCardTrigger>Hover</HoverCardTrigger>
      <HoverCardContent>Card</HoverCardContent>
    </HoverCard>,
    '[data-component="mizu-hover-card"]',
  ],
  [
    'Select',
    <Select key="se" open>
      <SelectTrigger aria-label="Region">
        <SelectValue placeholder="Pick" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">A</SelectItem>
      </SelectContent>
    </Select>,
    '.mizu-select__content',
  ],
  [
    'DropdownMenu',
    <DropdownMenu key="dm" open>
      <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
    '[data-component="mizu-dropdown-menu"]',
  ],
];

describe('portal identity', () => {
  it.each(CASES)(
    '%s copies identity, theme and density onto its portalled content',
    (_name, ui, selector) => {
      render(<Identity>{ui}</Identity>);
      const content = document.querySelector(selector);
      expect(content).not.toBeNull();
      for (const [attr, value] of Object.entries(IDENTITY_ATTRS)) {
        expect(content).toHaveAttribute(attr, value);
      }
    },
  );

  it('copies identity onto the Modal overlay as well as the content', () => {
    render(
      <Identity>
        <Modal open>
          <ModalContent>
            <ModalTitle>Title</ModalTitle>
          </ModalContent>
        </Modal>
      </Identity>,
    );
    const overlay = document.querySelector('.mizu-dialog__overlay');
    expect(overlay).toHaveAttribute('data-mizu-identity', 'sharp');
    expect(overlay).toHaveAttribute('data-theme', 'dark');
  });

  it('copies identity onto the AlertDialog and Drawer overlays', () => {
    render(
      <Identity>
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Title</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
        <Drawer open>
          <DrawerContent>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      </Identity>,
    );
    for (const selector of ['.mizu-alert-dialog__overlay', '.mizu-drawer__overlay']) {
      expect(document.querySelector(selector)).toHaveAttribute('data-mizu-identity', 'sharp');
    }
  });

  it('uses the nearest ancestor that sets each attribute', () => {
    render(
      <Identity attrs={{ 'data-mizu-identity': 'outer', 'data-theme': 'light' }}>
        <Identity attrs={{ 'data-mizu-identity': 'inner', 'data-mizu-density': 'comfortable' }}>
          <Popover open>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent>Body</PopoverContent>
          </Popover>
        </Identity>
      </Identity>,
    );
    const content = document.querySelector('[data-component="mizu-popover"]');
    expect(content).toHaveAttribute('data-mizu-identity', 'inner');
    expect(content).toHaveAttribute('data-mizu-density', 'comfortable');
    expect(content).toHaveAttribute('data-theme', 'light');
  });

  it('keeps an identity attribute the caller passes explicitly', () => {
    render(
      <Identity>
        <Popover open>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent data-theme="light">Body</PopoverContent>
        </Popover>
      </Identity>,
    );
    const content = document.querySelector('[data-component="mizu-popover"]');
    expect(content).toHaveAttribute('data-theme', 'light');
    expect(content).toHaveAttribute('data-mizu-identity', 'sharp');
  });

  it('sets no identity attributes when no ancestor carries them', () => {
    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>,
    );
    const content = document.querySelector('[data-component="mizu-popover"]');
    expect(content).not.toHaveAttribute('data-mizu-identity');
    expect(content).not.toHaveAttribute('data-theme');
    expect(content).not.toHaveAttribute('data-mizu-density');
  });

  it('copies identity onto a ContextMenu opened from inside the wrapper', () => {
    render(
      <Identity>
        <ContextMenu>
          <ContextMenuTrigger>Area</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Identity>,
    );
    fireEvent.contextMenu(screen.getByText('Area'));
    const content = document.querySelector('[data-component="mizu-context-menu"]');
    expect(content).not.toBeNull();
    expect(content).toHaveAttribute('data-mizu-identity', 'sharp');
    expect(content).toHaveAttribute('data-theme', 'dark');
  });

  it('copies identity from the combobox input onto its listbox', () => {
    render(
      <Identity>
        <Combobox
          options={[
            { value: 'us', label: 'United States' },
            { value: 'gb', label: 'United Kingdom' },
          ]}
        />
      </Identity>,
    );
    fireEvent.click(document.querySelector('input') as HTMLInputElement);
    const listbox = document.querySelector('[aria-label="Suggestions"]');
    expect(listbox).not.toBeNull();
    expect(listbox).toHaveAttribute('data-mizu-identity', 'sharp');
    expect(listbox).toHaveAttribute('data-theme', 'dark');
    expect(listbox).toHaveAttribute('data-mizu-density', 'compact');
  });
});

describe('copyPortalIdentity', () => {
  it('does nothing without a source or a target', () => {
    const target = document.createElement('div');
    expect(() => copyPortalIdentity(null, target)).not.toThrow();
    expect(() => copyPortalIdentity(document.createElement('span'), null)).not.toThrow();
    expect(target.attributes.length).toBe(0);
  });

  it('copies only the identity attributes', () => {
    const source = document.createElement('div');
    source.setAttribute('data-theme', 'dark');
    source.setAttribute('data-foo', 'bar');
    const child = document.createElement('span');
    source.appendChild(child);
    const target = document.createElement('div');
    copyPortalIdentity(child, target);
    expect(target).toHaveAttribute('data-theme', 'dark');
    expect(target).not.toHaveAttribute('data-foo');
  });
});
