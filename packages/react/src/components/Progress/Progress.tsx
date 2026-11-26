import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
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
  /** Screen-reader text for the current value, e.g. "3 of 5 files". Defaults to the percentage. */
  valueText?: string;
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    { className, value, max = 100, tone, label, showValue, indeterminate, valueText, ...props },
    ref,
  ) => {
    // Clamp before Radix sees the value: Radix treats anything outside 0..max as indeterminate.
    const clampedValue = value == null ? null : Math.min(max, Math.max(0, value));
    const percentage = clampedValue == null ? 0 : Math.round((clampedValue / max) * 100);

    return (
      <div
        data-component="mizu-progress"
        data-state={indeterminate ? 'indeterminate' : 'determinate'}
        className={cn('mizu-progress', className)}
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
          value={indeterminate ? null : clampedValue}
          max={max}
          getValueLabel={valueText ? () => valueText : undefined}
          {...props}
          aria-label={label || props['aria-label'] || 'Progress'}
        >
          <ProgressPrimitive.Indicator
            className={fillVariants({ tone })}
            style={indeterminate ? undefined : { width: `${percentage}%` }}
          />
        </ProgressPrimitive.Root>
      </div>
    );
  },
);
Progress.displayName = 'Progress';
