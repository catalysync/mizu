import * as React from 'react';
import * as Menu from '@radix-ui/react-dropdown-menu';
import { cn } from '../../utils/cn';

export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;
export const DropdownMenuGroup = Menu.Group;
export const DropdownMenuSub = Menu.Sub;
export const DropdownMenuRadioGroup = Menu.RadioGroup;

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof Menu.Content>,
  React.ComponentPropsWithoutRef<typeof Menu.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <Menu.Portal>
    <Menu.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn('mizu-dropdown-menu', className)}
      {...props}
    />
  </Menu.Portal>
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

export interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<typeof Menu.Item> {
  danger?: boolean;
}

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof Menu.Item>,
  DropdownMenuItemProps
>(({ className, danger, ...props }, ref) => (
  <Menu.Item
    ref={ref}
    className={cn(
      'mizu-dropdown-menu__item',
      danger && 'mizu-dropdown-menu__item--danger',
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof Menu.Label>,
  React.ComponentPropsWithoutRef<typeof Menu.Label>
>(({ className, ...props }, ref) => (
  <Menu.Label ref={ref} className={cn('mizu-dropdown-menu__label', className)} {...props} />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof Menu.Separator>,
  React.ComponentPropsWithoutRef<typeof Menu.Separator>
>(({ className, ...props }, ref) => (
  <Menu.Separator ref={ref} className={cn('mizu-dropdown-menu__separator', className)} {...props} />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
