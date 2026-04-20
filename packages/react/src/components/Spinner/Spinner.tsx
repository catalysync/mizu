import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../utils/cn';

const spinnerVariants = cva('mizu-spinner', {
  variants: {
    size: {
      xs: 'mizu-spinner--size-xs',
      sm: 'mizu-spinner--size-sm',
      md: 'mizu-spinner--size-md',
      lg: 'mizu-spinner--size-lg',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

export type SpinnerSize = NonNullable<VariantProps<typeof spinnerVariants>['size']>;

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  size?: SpinnerSize;
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, label = 'Loading', role = 'status', ...props }, ref) => (
    <span
      ref={ref}
      role={role}
      aria-live="polite"
      className={cn(spinnerVariants({ size, className }))}
      data-component="mizu-spinner"
      {...props}
    >
      <span className="mizu-sr-only">{label}</span>
    </span>
  ),
);
Spinner.displayName = 'Spinner';
