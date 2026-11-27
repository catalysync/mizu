import * as ToastPrimitive from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { useLocale } from '../../i18n';
import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../Button';
import { dismissToast, getToastsSnapshot, subscribeToasts } from './toast-queue';

const toastVariants = cva('mizu-toast', {
  variants: {
    tone: {
      default: '',
      success: 'mizu-toast--success',
      warning: 'mizu-toast--warning',
      danger: 'mizu-toast--danger',
      info: 'mizu-toast--info',
    },
  },
  defaultVariants: { tone: 'default' },
});

// No locale key exists for notifications yet, so the English label is a default that a prop overrides.
const DEFAULT_VIEWPORT_LABEL = 'Notifications ({hotkey})';

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, label = DEFAULT_VIEWPORT_LABEL, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    label={label}
    className={cn('mizu-toast-viewport', className)}
    {...props}
  />
));
ToastViewport.displayName = 'ToastViewport';

export interface ToastProps
  extends
    React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
    VariantProps<typeof toastVariants> {
  /** Buttons rendered in a row under the toast content. */
  actions?: ButtonProps[];
}

export const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, tone, actions, children, ...props }, ref) => {
    const hasActions = actions !== undefined && actions.length > 0;
    return (
      <ToastPrimitive.Root
        ref={ref}
        data-component="mizu-toast"
        data-has-actions={hasActions || undefined}
        className={cn(toastVariants({ tone, className }))}
        {...props}
      >
        {children}
        {hasActions && (
          <div className="mizu-toast__actions">
            {actions.map((action, index) => (
              <Button key={index} size="sm" variant="secondary" {...action} />
            ))}
          </div>
        )}
      </ToastPrimitive.Root>
    );
  },
);
Toast.displayName = 'Toast';

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn('mizu-toast__title', className)} {...props} />
));
ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('mizu-toast__description', className)}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

export const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => {
  const locale = useLocale();
  return (
    <ToastPrimitive.Close
      ref={ref}
      aria-label={locale.actions.close}
      className={cn('mizu-toast__close', className)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        width="14"
        height="14"
        aria-hidden="true"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </ToastPrimitive.Close>
  );
});
ToastClose.displayName = 'ToastClose';

export interface ToasterProps {
  /** Overrides the viewport landmark label. */
  label?: string;
}

/** Renders the queue filled by `toast()`. Mount once per app. */
export const Toaster = ({ label }: ToasterProps) => {
  const items = React.useSyncExternalStore(subscribeToasts, getToastsSnapshot, getToastsSnapshot);
  return (
    <ToastProvider>
      {items.map((item) => (
        <Toast
          key={item.id}
          open
          tone={item.tone}
          actions={item.actions}
          onOpenChange={(open) => {
            if (!open) dismissToast(item.id);
          }}
        >
          <div className="mizu-toast__content">
            <ToastTitle>{item.title}</ToastTitle>
            {item.description !== undefined && (
              <ToastDescription>{item.description}</ToastDescription>
            )}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport label={label} />
    </ToastProvider>
  );
};
Toaster.displayName = 'Toaster';
