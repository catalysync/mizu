import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
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
export type BadgeAppearance = 'default' | 'dot';

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
  count?: number;
  maxCount?: number;
  /** What the count measures, e.g. "unread messages". Becomes part of the accessible name. */
  label?: string;
  size?: BadgeSize;
  /** `dot` renders a solid status marker with no visible text; children become screen-reader text. */
  appearance?: BadgeAppearance;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      tone,
      dot,
      count,
      maxCount = 99,
      label,
      size = 'md',
      appearance = 'default',
      children,
      ...props
    },
    ref,
  ) => {
    const isDotOnly = appearance === 'dot';
    const displayCount = count != null ? (count > maxCount ? `${maxCount}+` : String(count)) : null;
    // A span has no role, so aria-label would be ignored; role="img" gives the count a name.
    const countName =
      displayCount != null ? (label ? `${displayCount} ${label}` : displayCount) : undefined;

    return (
      <span
        ref={ref}
        data-component="mizu-badge"
        className={cn(badgeVariants({ tone, className }))}
        data-size={size}
        data-appearance={isDotOnly ? 'dot' : undefined}
        data-count={displayCount != null ? 'true' : undefined}
        {...(countName != null ? { role: 'img', 'aria-label': countName } : {})}
        {...props}
      >
        {isDotOnly ? (
          children ? (
            <span className="mizu-sr-only">{children}</span>
          ) : null
        ) : (
          <>
            {dot ? <span className="mizu-badge__dot" aria-hidden="true" /> : null}
            {displayCount ?? children}
          </>
        )}
      </span>
    );
  },
);
Badge.displayName = 'Badge';
