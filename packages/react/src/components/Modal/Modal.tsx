import * as Dialog from '@radix-ui/react-dialog';
import * as React from 'react';
import { cn } from '../../utils/cn';

export const Modal = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close;

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

export interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof Dialog.Content> {
  size?: ModalSize;
  /** Extra classes for the scrim behind the content. */
  overlayClassName?: string;
  /** Extra props for the scrim, e.g. `data-*` hooks. */
  overlayProps?: React.ComponentPropsWithoutRef<typeof Dialog.Overlay>;
  /** When false, Escape and clicks or focus outside the content do not close it. Defaults to true. */
  dismissable?: boolean;
  /** When false, the built-in close icon is not rendered. Defaults to true. */
  closeButton?: boolean;
}

export const ModalContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  ModalContentProps
>(
  (
    {
      className,
      children,
      size = 'md',
      overlayClassName,
      overlayProps,
      dismissable = true,
      closeButton = true,
      onEscapeKeyDown,
      onInteractOutside,
      ...props
    },
    ref,
  ) => (
    <Dialog.Portal>
      <Dialog.Overlay
        {...overlayProps}
        className={cn('mizu-dialog__overlay', overlayClassName, overlayProps?.className)}
      />
      <Dialog.Content
        ref={ref}
        data-component="mizu-modal"
        className={cn('mizu-dialog__content', className)}
        data-size={size}
        onEscapeKeyDown={(event) => {
          if (!dismissable) event.preventDefault();
          onEscapeKeyDown?.(event);
        }}
        // Radix routes pointer-down and focus-outside through this handler; preventing it keeps the dialog open.
        onInteractOutside={(event) => {
          if (!dismissable) event.preventDefault();
          onInteractOutside?.(event);
        }}
        {...props}
      >
        {children}
        {closeButton ? (
          <Dialog.Close className="mizu-dialog__close" aria-label="Close">
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
        ) : null}
      </Dialog.Content>
    </Dialog.Portal>
  ),
);
ModalContent.displayName = 'ModalContent';

export const ModalHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-dialog__header', className)} {...props} />
  ),
);
ModalHeader.displayName = 'ModalHeader';

export const ModalTitle = React.forwardRef<
  React.ElementRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title ref={ref} className={cn('mizu-dialog__title', className)} {...props} />
));
ModalTitle.displayName = 'ModalTitle';

export const ModalDescription = React.forwardRef<
  React.ElementRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description ref={ref} className={cn('mizu-dialog__description', className)} {...props} />
));
ModalDescription.displayName = 'ModalDescription';

export const ModalBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-dialog__body', className)} {...props} />
  ),
);
ModalBody.displayName = 'ModalBody';

export const ModalFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-dialog__footer', className)} {...props} />
  ),
);
ModalFooter.displayName = 'ModalFooter';
