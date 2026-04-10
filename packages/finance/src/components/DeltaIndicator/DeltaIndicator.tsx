import * as React from 'react';
import { cn } from '@aspect/react';
import { formatDelta, deltaIntent, type DeltaIntent } from '../../utils/delta';

export interface DeltaIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  showArrow?: boolean;
}

const intentClass: Record<DeltaIntent, string> = {
  positive: 'mizu-delta--positive',
  negative: 'mizu-delta--negative',
  neutral: 'mizu-delta--neutral',
};

export const DeltaIndicator = React.forwardRef<HTMLSpanElement, DeltaIndicatorProps>(
  ({ value, showArrow = true, className, ...props }, ref) => {
    const intent = deltaIntent(value);
    return (
      <span ref={ref} className={cn('mizu-delta', intentClass[intent], className)} {...props}>
        {showArrow && intent !== 'neutral' && (
          <svg
            className="mizu-delta__arrow"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
            fill="currentColor"
            aria-hidden="true"
          >
            {intent === 'positive' ? <path d="M6 2l4 5H2z" /> : <path d="M6 10L2 5h8z" />}
          </svg>
        )}
        {formatDelta(value)}
      </span>
    );
  },
);
DeltaIndicator.displayName = 'DeltaIndicator';
