import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const tagVariants = cva('mizu-tag', {
  variants: {
    tone: {
      neutral: 'mizu-tag--neutral',
      success: 'mizu-tag--success',
      warning: 'mizu-tag--warning',
      danger: 'mizu-tag--danger',
      info: 'mizu-tag--info',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
  onDismiss?: () => void;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, tone, onDismiss, children, ...props }, ref) => (
    <span ref={ref} className={cn(tagVariants({ tone, className }))} {...props}>
      <span className="mizu-tag__label">{children}</span>
      {onDismiss && (
        <button type="button" className="mizu-tag__dismiss" onClick={onDismiss} aria-label="Remove">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            width="12"
            height="12"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  ),
);
Tag.displayName = 'Tag';
