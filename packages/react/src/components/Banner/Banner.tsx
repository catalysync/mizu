import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../utils/cn';

const bannerVariants = cva('mizu-banner', {
  variants: {
    tone: {
      info: 'mizu-banner--info',
      success: 'mizu-banner--success',
      warning: 'mizu-banner--warning',
      critical: 'mizu-banner--critical',
    },
  },
  defaultVariants: { tone: 'info' },
});

export interface BannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof bannerVariants> {
  title?: string;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    { title, tone, onDismiss, dismissLabel = 'Dismiss', role, children, className, ...props },
    ref,
  ) => {
    const resolvedTone = tone ?? 'info';
    // Critical banners interrupt assistive tech like danger alerts; the rest are polite status updates.
    const defaultRole = resolvedTone === 'critical' ? 'alert' : 'status';
    return (
      <div
        ref={ref}
        role={role ?? defaultRole}
        className={cn(bannerVariants({ tone: resolvedTone, className }))}
        {...props}
      >
        <div className="mizu-banner__body">
          {title && <div className="mizu-banner__title">{title}</div>}
          {children}
        </div>
        {onDismiss && (
          <button
            type="button"
            className="mizu-banner__dismiss"
            onClick={onDismiss}
            aria-label={dismissLabel}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="14"
              height="14"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
Banner.displayName = 'Banner';
