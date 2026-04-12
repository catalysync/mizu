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
      ...props
    },
    ref,
  ) => {
    if (size === 'icon' && !props['aria-label'] && !props['aria-labelledby']) {
      Logger.warn(
        'Button with size="icon" has no aria-label or aria-labelledby. Icon-only buttons are inaccessible without a text alternative.',
      );
    }

    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        data-component="mizu-button"
        className={cn(buttonVariants({ variant, size, className }))}
        data-loading={loading || undefined}
        data-inverse={inverse || undefined}
        data-full-width={fullWidth || undefined}
        aria-busy={loading || undefined}
        type={asChild ? undefined : type}
        disabled={disabled ?? loading}
        {...props}
      >
        {loading ? (
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
