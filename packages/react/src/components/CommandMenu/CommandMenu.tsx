import * as Dialog from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';
import { cn } from '../../utils/cn';

export type CommandMenuProps = React.ComponentPropsWithoutRef<typeof Dialog.Root>;

export const CommandMenu = ({ children, ...props }: CommandMenuProps) => (
  <Dialog.Root {...props}>
    <Dialog.Portal>
      <Dialog.Overlay className="mizu-command-menu__overlay" />
      <Dialog.Content
        data-component="mizu-command-menu"
        className="mizu-command-menu__dialog"
        aria-label="Command menu"
      >
        <CommandPrimitive>{children}</CommandPrimitive>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
CommandMenu.displayName = 'CommandMenu';

export const CommandMenuInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="mizu-command-menu__input-wrapper">
    <svg
      className="mizu-command-menu__search-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
    <CommandPrimitive.Input
      ref={ref}
      className={cn('mizu-command-menu__input', className)}
      {...props}
    />
  </div>
));
CommandMenuInput.displayName = 'CommandMenuInput';

export const CommandMenuList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('mizu-command-menu__list', className)}
    {...props}
  />
));
CommandMenuList.displayName = 'CommandMenuList';

export const CommandMenuEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn('mizu-command-menu__empty', className)}
    {...props}
  />
));
CommandMenuEmpty.displayName = 'CommandMenuEmpty';

export const CommandMenuGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, heading, ...props }, ref) => (
  <CommandPrimitive.Group ref={ref} className={className} heading={heading} {...props} />
));
CommandMenuGroup.displayName = 'CommandMenuGroup';

export const CommandMenuItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn('mizu-command-menu__item', className)}
    {...props}
  />
));
CommandMenuItem.displayName = 'CommandMenuItem';

export const CommandMenuSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('mizu-command-menu__separator', className)}
    {...props}
  />
));
CommandMenuSeparator.displayName = 'CommandMenuSeparator';
