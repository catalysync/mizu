import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../Button';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  label?: React.ReactNode;
  siblingCount?: number;
  showPageNumbers?: boolean;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildPageList(
  current: number,
  total: number,
  siblings: number,
): Array<number | 'ellipsis'> {
  if (total <= 1) return [1];
  const first = 1;
  const last = total;
  const leftSibling = Math.max(current - siblings, first);
  const rightSibling = Math.min(current + siblings, last);
  const showLeftEllipsis = leftSibling > first + 1;
  const showRightEllipsis = rightSibling < last - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(first, Math.max(1 + siblings * 2 + 1, rightSibling));
    return [...leftRange, 'ellipsis', last];
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(Math.min(last - siblings * 2 - 1, leftSibling), last);
    return [first, 'ellipsis', ...rightRange];
  }
  if (showLeftEllipsis && showRightEllipsis) {
    return [first, 'ellipsis', ...range(leftSibling, rightSibling), 'ellipsis', last];
  }
  return range(first, last);
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      page,
      totalPages,
      onPageChange,
      hasNext,
      hasPrevious,
      onNext,
      onPrevious,
      label,
      siblingCount = 1,
      showPageNumbers = true,
      ...props
    },
    ref,
  ) => {
    const hasPageNumbers =
      showPageNumbers && typeof page === 'number' && typeof totalPages === 'number';
    const resolvedHasPrevious = hasPrevious ?? (typeof page === 'number' ? page > 1 : false);
    const resolvedHasNext =
      hasNext ??
      (typeof page === 'number' && typeof totalPages === 'number' ? page < totalPages : false);

    const goTo = (p: number) => {
      if (typeof totalPages === 'number' && (p < 1 || p > totalPages)) return;
      onPageChange?.(p);
    };

    const handlePrevious = () => {
      onPrevious?.();
      if (typeof page === 'number' && page > 1) goTo(page - 1);
    };
    const handleNext = () => {
      onNext?.();
      if (typeof page === 'number' && typeof totalPages === 'number' && page < totalPages) {
        goTo(page + 1);
      }
    };

    return (
      <nav
        ref={ref}
        className={cn('mizu-pagination', className)}
        aria-label="Pagination"
        {...props}
      >
        {label != null ? <span>{label}</span> : <span />}
        <div className="mizu-pagination__buttons">
          <Button
            size="sm"
            variant="ghost"
            disabled={!resolvedHasPrevious}
            onClick={handlePrevious}
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
          {hasPageNumbers ? (
            <div className="mizu-pagination__pages">
              {buildPageList(page!, totalPages!, siblingCount).map((entry, i) =>
                entry === 'ellipsis' ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="mizu-pagination__ellipsis"
                    aria-hidden="true"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={entry}
                    type="button"
                    className="mizu-pagination__page"
                    data-current={entry === page || undefined}
                    aria-current={entry === page ? 'page' : undefined}
                    aria-label={`Go to page ${entry}`}
                    onClick={() => goTo(entry)}
                  >
                    {entry}
                  </button>
                ),
              )}
            </div>
          ) : null}
          <Button
            size="sm"
            variant="ghost"
            disabled={!resolvedHasNext}
            onClick={handleNext}
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
      </nav>
    );
  },
);
Pagination.displayName = 'Pagination';
