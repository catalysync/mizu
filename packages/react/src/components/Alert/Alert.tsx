import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
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

// Danger interrupts assistive tech immediately; other tones are polite status updates.
const alertRoleForTone = (tone: 'info' | 'success' | 'warning' | 'danger') =>
  tone === 'danger' ? 'alert' : 'status';

const toneIconPaths: Record<'info' | 'success' | 'warning' | 'danger', React.ReactNode> = {
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </>
  ),
  success: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  warning: (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  danger: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </>
  ),
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  /** Pass `null` to hide the icon. Omit it to show the default icon for the tone. */
  icon?: React.ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { className, tone, icon, onDismiss, dismissLabel = 'Dismiss', role, children, ...props },
    ref,
  ) => {
    const resolvedTone = tone ?? 'info';
    const resolvedIcon =
      icon === undefined ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="20"
          height="20"
          aria-hidden="true"
        >
          {toneIconPaths[resolvedTone]}
        </svg>
      ) : (
        icon
      );
    return (
      <div
        ref={ref}
        role={role ?? alertRoleForTone(resolvedTone)}
        data-component="mizu-alert"
        className={cn(alertVariants({ tone: resolvedTone, className }))}
        {...props}
      >
        {resolvedIcon && (
          <span className="mizu-alert__icon" aria-hidden="true">
            {resolvedIcon}
          </span>
        )}
        <div className="mizu-alert__content">{children}</div>
        {onDismiss && (
          <button
            type="button"
            className="mizu-alert__dismiss"
            onClick={onDismiss}
            aria-label={dismissLabel}
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
    );
  },
);
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-alert__title', className)} {...props} />
  ),
);
AlertTitle.displayName = 'AlertTitle';
