import * as React from 'react';
import { cn } from '../../utils/cn';

export type LinkVariant = 'inline' | 'subtle' | 'standalone';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  /**
   * When true (or auto-detected from `target="_blank"`), sets `rel="noopener noreferrer"`,
   * renders an external-link icon, and appends an sr-only "opens in new tab" hint.
   */
  external?: boolean;
  /** sr-only text announced to screen readers when `external` is true. */
  externalLabel?: string;
  /** Hide the external-link icon (keeps the sr-only hint). */
  hideExternalIcon?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant = 'inline',
      external,
      externalLabel = 'opens in new tab',
      hideExternalIcon,
      target,
      rel,
      children,
      ...props
    },
    ref,
  ) => {
    const isExternal = external ?? target === '_blank';
    const resolvedTarget = external === true ? (target ?? '_blank') : target;
    const resolvedRel = isExternal
      ? [rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ')
      : rel;
    return (
      <a
        ref={ref}
        className={cn('mizu-link', className)}
        data-component="mizu-link"
        data-variant={variant}
        data-external={isExternal || undefined}
        data-hide-external-icon={hideExternalIcon || undefined}
        target={resolvedTarget}
        rel={resolvedRel}
        {...props}
      >
        {children}
        {isExternal ? <span className="sr-only"> ({externalLabel})</span> : null}
      </a>
    );
  },
);
Link.displayName = 'Link';
