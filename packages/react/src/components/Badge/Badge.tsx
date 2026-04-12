import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva('mizu-badge', {
  variants: {
    tone: {
      neutral: 'mizu-badge--neutral',
      success: 'mizu-badge--success',
      warning: 'mizu-badge--warning',
      danger: 'mizu-badge--danger',
      info: 'mizu-badge--info',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
  count?: number;
  maxCount?: number;
  size?: BadgeSize;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone, dot, count, maxCount = 99, size, children, ...props }, ref) => {
    const displayCount = count != null ? (count > maxCount ? `${maxCount}+` : String(count)) : null;

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ tone, className }))}
        data-size={size ?? undefined}
        data-count={displayCount != null ? 'true' : undefined}
        {...props}
      >
        {dot ? <span className="mizu-badge__dot" aria-hidden="true" /> : null}
        {displayCount ?? children}
      </span>
    );
  },
);
Badge.displayName = 'Badge';
