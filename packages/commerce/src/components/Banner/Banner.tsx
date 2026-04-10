import * as React from 'react';
import { cn } from '@aspect/react';
import { cva, type VariantProps } from 'class-variance-authority';

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
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ title, tone, onDismiss, children, className, ...props }, ref) => (
    <div ref={ref} role="status" className={cn(bannerVariants({ tone, className }))} {...props}>
      <div className="mizu-banner__body">
        {title && <div className="mizu-banner__title">{title}</div>}
        {children}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="mizu-banner__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="14"
            height="14"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  ),
);
Banner.displayName = 'Banner';
