import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Logger } from '../../utils/logger';

const buttonVariants = cva('mizu-button', {
  variants: {
    variant: {
      primary: 'mizu-button--primary',
      secondary: 'mizu-button--secondary',
      ghost: 'mizu-button--ghost',
      destructive: 'mizu-button--destructive',
      gradient: 'mizu-button--gradient',
    },
    size: {
      sm: 'mizu-button--sm',
      md: 'mizu-button--md',
      lg: 'mizu-button--lg',
      icon: 'mizu-button--icon',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  inverse?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      inverse = false,
      fullWidth = false,
      disabled,
      type = 'button',
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    if (size === 'icon' && !props['aria-label'] && !props['aria-labelledby']) {
      Logger.warn(
        'Button with size="icon" has no aria-label or aria-labelledby. Icon-only buttons are inaccessible without a text alternative.',
      );
    }

    // Auto-surface loading state when the consumer's onClick returns a Promise.
    // Merges with the controlled `loading` prop so callers can still opt in
    // manually; the button is busy if either source says so.
    const [autoLoading, setAutoLoading] = React.useState(false);
    const isLoading = loading || autoLoading;

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        const result = onClick?.(e);
        if (result && typeof (result as { then?: unknown }).then === 'function') {
          setAutoLoading(true);
          // `allSettled` waits for resolution without forking the caller's
          // promise chain — their own error handling (or lack of it) is
          // preserved. We just use completion as the signal to clear loading.
          Promise.allSettled([result as Promise<unknown>]).then(() => {
            setAutoLoading(false);
          });
        }
      },
      [onClick],
    );

    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        data-component="mizu-button"
        className={cn(buttonVariants({ variant, size, className }))}
        data-loading={isLoading || undefined}
        data-inverse={inverse || undefined}
        data-full-width={fullWidth || undefined}
        aria-busy={isLoading || undefined}
        type={asChild ? undefined : type}
        disabled={disabled ?? isLoading}
        onClick={handleClick}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="mizu-button__label">{children}</span>
            <span className="mizu-button__spinner" aria-hidden="true" />
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
