import * as Menu from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { ChevronRight } from '../../icons';
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
      data-component="mizu-dropdown-menu"
      className={cn('mizu-dropdown-menu', className)}
      {...props}
    />
  </Menu.Portal>
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

export interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<typeof Menu.Item> {
  danger?: boolean;
  inset?: boolean;
}

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof Menu.Item>,
  DropdownMenuItemProps
>(({ className, danger, inset, ...props }, ref) => (
  <Menu.Item
    ref={ref}
    className={cn(
      'mizu-dropdown-menu__item',
      inset && 'mizu-dropdown-menu__item--inset',
      danger && 'mizu-dropdown-menu__item--danger',
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof Menu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof Menu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <Menu.CheckboxItem
    ref={ref}
    className={cn('mizu-dropdown-menu__item', 'mizu-dropdown-menu__item--checkable', className)}
    {...props}
  >
    <span className="mizu-dropdown-menu__indicator" aria-hidden="true">
      <Menu.ItemIndicator>
        <CheckGlyph />
      </Menu.ItemIndicator>
    </span>
    {children}
  </Menu.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof Menu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof Menu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <Menu.RadioItem
    ref={ref}
    className={cn('mizu-dropdown-menu__item', 'mizu-dropdown-menu__item--checkable', className)}
    {...props}
  >
    <span className="mizu-dropdown-menu__indicator" aria-hidden="true">
      <Menu.ItemIndicator>
        <DotGlyph />
      </Menu.ItemIndicator>
    </span>
    {children}
  </Menu.RadioItem>
));
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

export const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof Menu.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof Menu.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <Menu.SubTrigger
    ref={ref}
    className={cn(
      'mizu-dropdown-menu__item',
      'mizu-dropdown-menu__sub-trigger',
      inset && 'mizu-dropdown-menu__item--inset',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="mizu-dropdown-menu__sub-caret" aria-hidden="true" />
  </Menu.SubTrigger>
));
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof Menu.SubContent>,
  React.ComponentPropsWithoutRef<typeof Menu.SubContent>
>(({ className, ...props }, ref) => (
  <Menu.Portal>
    <Menu.SubContent ref={ref} className={cn('mizu-dropdown-menu', className)} {...props} />
  </Menu.Portal>
));
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof Menu.Label>,
  React.ComponentPropsWithoutRef<typeof Menu.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <Menu.Label
    ref={ref}
    className={cn(
      'mizu-dropdown-menu__label',
      inset && 'mizu-dropdown-menu__item--inset',
      className,
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof Menu.Separator>,
  React.ComponentPropsWithoutRef<typeof Menu.Separator>
>(({ className, ...props }, ref) => (
  <Menu.Separator ref={ref} className={cn('mizu-dropdown-menu__separator', className)} {...props} />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

export const DropdownMenuShortcut = React.forwardRef<HTMLSpanElement, DropdownMenuShortcutProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('mizu-dropdown-menu__shortcut', className)} {...props} />
  ),
);
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function DotGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="8" height="8" fill="currentColor">
      <circle cx="12" cy="12" r="6" />
    </svg>
  );
}
