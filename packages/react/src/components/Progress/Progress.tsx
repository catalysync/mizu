import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const fillVariants = cva('mizu-progress__fill', {
  variants: {
    tone: {
      default: '',
      success: 'mizu-progress__fill--success',
      warning: 'mizu-progress__fill--warning',
      danger: 'mizu-progress__fill--danger',
    },
  },
  defaultVariants: { tone: 'default' },
});

export interface ProgressProps
  extends
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof fillVariants> {
  label?: string;
  showValue?: boolean;
  indeterminate?: boolean;
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, max = 100, tone, label, showValue, indeterminate, ...props }, ref) => {
  const percentage = value != null ? Math.round((value / max) * 100) : 0;

  return (
    <div
      className={cn('mizu-progress', indeterminate && 'mizu-progress--indeterminate', className)}
    >
      {(label || showValue) && (
        <div className="mizu-progress__label">
          {label && <span>{label}</span>}
          {showValue && !indeterminate && <span>{percentage}%</span>}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className="mizu-progress__track"
        value={indeterminate ? null : value}
        max={max}
        aria-label={label || props['aria-label'] || 'Progress'}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={fillVariants({ tone })}
          style={indeterminate ? undefined : { width: `${percentage}%` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
});
Progress.displayName = 'Progress';
