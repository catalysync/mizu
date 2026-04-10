import * as React from 'react';
import { cn, Button } from '@aspect/react';

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  hasNext?: boolean;
  hasPrevious?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  label?: React.ReactNode;
}

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ hasNext, hasPrevious, onNext, onPrevious, label, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mizu-pagination', className)}
      role="navigation"
      aria-label="Pagination"
      {...props}
    >
      <span>{label}</span>
      <div className="mizu-pagination__buttons">
        <Button
          size="sm"
          variant="ghost"
          disabled={!hasPrevious}
          onClick={onPrevious}
          aria-label="Previous page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="16"
            height="16"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={!hasNext}
          onClick={onNext}
          aria-label="Next page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="16"
            height="16"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      </div>
    </div>
  ),
);
Pagination.displayName = 'Pagination';
