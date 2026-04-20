import * as Dialog from '@radix-ui/react-dialog';
import * as React from 'react';
import { cn } from '../../utils/cn';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

export const Drawer = Dialog.Root;
export const DrawerTrigger = Dialog.Trigger;
export const DrawerClose = Dialog.Close;

export interface DrawerContentProps extends React.ComponentPropsWithoutRef<typeof Dialog.Content> {
  side?: DrawerSide;
}

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  DrawerContentProps
>(({ className, children, side = 'right', ...props }, ref) => (
  <Dialog.Portal>
    <Dialog.Overlay className="mizu-drawer__overlay" />
    <Dialog.Content
      ref={ref}
      data-component="mizu-drawer"
      className={cn('mizu-drawer__content', className)}
      data-side={side}
      {...props}
    >
      {children}
    </Dialog.Content>
  </Dialog.Portal>
));
DrawerContent.displayName = 'DrawerContent';

export const DrawerHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-drawer__header', className)} {...props} />
  ),
);
DrawerHeader.displayName = 'DrawerHeader';

export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title ref={ref} className={cn('mizu-drawer__title', className)} {...props} />
));
DrawerTitle.displayName = 'DrawerTitle';

export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description ref={ref} className={cn('mizu-drawer__description', className)} {...props} />
));
DrawerDescription.displayName = 'DrawerDescription';

export const DrawerBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-drawer__body', className)} {...props} />
  ),
);
DrawerBody.displayName = 'DrawerBody';

export const DrawerFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-drawer__footer', className)} {...props} />
  ),
);
DrawerFooter.displayName = 'DrawerFooter';
