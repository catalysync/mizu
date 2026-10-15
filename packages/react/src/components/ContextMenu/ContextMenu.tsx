import * as Menu from '@radix-ui/react-context-menu';
import * as React from 'react';
import { cn } from '../../utils/cn';
import { MenuCheckGlyph, MenuDotGlyph } from '../../utils/menu-glyphs';

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

export const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof Menu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof Menu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <Menu.CheckboxItem
    ref={ref}
    className={cn('mizu-context-menu__item', 'mizu-context-menu__item--checkable', className)}
    {...props}
  >
    <span className="mizu-context-menu__indicator" aria-hidden="true">
      <Menu.ItemIndicator>
        <MenuCheckGlyph />
      </Menu.ItemIndicator>
    </span>
    {children}
  </Menu.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem';

export const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof Menu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof Menu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <Menu.RadioItem
    ref={ref}
    className={cn('mizu-context-menu__item', 'mizu-context-menu__item--checkable', className)}
    {...props}
  >
    <span className="mizu-context-menu__indicator" aria-hidden="true">
      <Menu.ItemIndicator>
        <MenuDotGlyph />
      </Menu.ItemIndicator>
    </span>
    {children}
  </Menu.RadioItem>
));
ContextMenuRadioItem.displayName = 'ContextMenuRadioItem';

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
