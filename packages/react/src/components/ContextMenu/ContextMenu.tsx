import * as React from 'react';
import * as Menu from '@radix-ui/react-context-menu';
import { cn } from '../../utils/cn';

export const ContextMenu = Menu.Root;
export const ContextMenuTrigger = Menu.Trigger;
export const ContextMenuGroup = Menu.Group;
export const ContextMenuSub = Menu.Sub;
export const ContextMenuRadioGroup = Menu.RadioGroup;

export const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof Menu.Content>,
  React.ComponentPropsWithoutRef<typeof Menu.Content>
>(({ className, ...props }, ref) => (
  <Menu.Portal>
    <Menu.Content
      ref={ref}
      data-component="mizu-context-menu"
      className={cn('mizu-context-menu', className)}
      {...props}
    />
  </Menu.Portal>
));
ContextMenuContent.displayName = 'ContextMenuContent';

export interface ContextMenuItemProps extends React.ComponentPropsWithoutRef<typeof Menu.Item> {
  danger?: boolean;
}

export const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof Menu.Item>,
  ContextMenuItemProps
>(({ className, danger, ...props }, ref) => (
  <Menu.Item
    ref={ref}
    className={cn(
      'mizu-context-menu__item',
      danger && 'mizu-context-menu__item--danger',
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = 'ContextMenuItem';

export const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof Menu.Label>,
  React.ComponentPropsWithoutRef<typeof Menu.Label>
>(({ className, ...props }, ref) => (
  <Menu.Label ref={ref} className={cn('mizu-context-menu__label', className)} {...props} />
));
ContextMenuLabel.displayName = 'ContextMenuLabel';

export const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof Menu.Separator>,
  React.ComponentPropsWithoutRef<typeof Menu.Separator>
>(({ className, ...props }, ref) => (
  <Menu.Separator ref={ref} className={cn('mizu-context-menu__separator', className)} {...props} />
));
ContextMenuSeparator.displayName = 'ContextMenuSeparator';
