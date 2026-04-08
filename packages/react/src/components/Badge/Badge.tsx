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

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone, dot, children, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ tone, className }))} {...props}>
      {dot && <span className="mizu-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  ),
);
Badge.displayName = 'Badge';
