import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { useLocale } from '../../i18n';
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
  /** Accessible name. Defaults to the loading string of the active `I18nProvider` locale. */
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, label, role = 'status', ...props }, ref) => {
    const locale = useLocale();
    return (
      <span
        ref={ref}
        role={role}
        aria-live="polite"
        className={cn(spinnerVariants({ size, className }))}
        data-component="mizu-spinner"
        {...props}
      >
        <span className="mizu-sr-only">{label ?? locale.feedback.loading}</span>
      </span>
    );
  },
);
Spinner.displayName = 'Spinner';
