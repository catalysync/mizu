import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva('mizu-button', {
  variants: {
    variant: {
      primary: 'mizu-button--primary',
      secondary: 'mizu-button--secondary',
      ghost: 'mizu-button--ghost',
      destructive: 'mizu-button--destructive',
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      type = 'button',
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        data-component="mizu-button"
        className={cn(buttonVariants({ variant, size, className }))}
        data-loading={loading || undefined}
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
