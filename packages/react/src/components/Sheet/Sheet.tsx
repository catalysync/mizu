import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '../../utils/cn';

export type SheetSide = 'left' | 'right' | 'top' | 'bottom';

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof Dialog.Content> {
  side?: SheetSide;
}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  SheetContentProps
>(({ className, children, side = 'right', ...props }, ref) => (
  <Dialog.Portal>
    <Dialog.Overlay className="mizu-sheet__overlay" />
    <Dialog.Content
      ref={ref}
      data-component="mizu-sheet"
      className={cn('mizu-sheet__content', className)}
      data-side={side}
      {...props}
    >
      {children}
      <Dialog.Close className="mizu-sheet__close" aria-label="Close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          width="16"
          height="16"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
));
SheetContent.displayName = 'SheetContent';

export const SheetHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-sheet__header', className)} {...props} />
  ),
);
SheetHeader.displayName = 'SheetHeader';

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title ref={ref} className={cn('mizu-sheet__title', className)} {...props} />
));
SheetTitle.displayName = 'SheetTitle';

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description ref={ref} className={cn('mizu-sheet__description', className)} {...props} />
));
SheetDescription.displayName = 'SheetDescription';

export const SheetBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-sheet__body', className)} {...props} />
  ),
);
SheetBody.displayName = 'SheetBody';
