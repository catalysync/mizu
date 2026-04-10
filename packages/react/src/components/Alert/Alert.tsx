import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const alertVariants = cva('mizu-alert', {
  variants: {
    tone: {
      info: 'mizu-alert--info',
      success: 'mizu-alert--success',
      warning: 'mizu-alert--warning',
      danger: 'mizu-alert--danger',
    },
  },
  defaultVariants: { tone: 'info' },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  onDismiss?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone, icon, onDismiss, children, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ tone, className }))} {...props}>
      {icon && (
        <span className="mizu-alert__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="mizu-alert__content">{children}</div>
      {onDismiss && (
        <button
          type="button"
          className="mizu-alert__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            width="14"
            height="14"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  ),
);
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-alert__title', className)} {...props} />
  ),
);
AlertTitle.displayName = 'AlertTitle';
