import * as React from 'react';
import { cn } from '../../utils/cn';

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Section title — typically 1-3 words. Renders as an h2 by default. */
  title: React.ReactNode;
  /** Short description. Renders below the title. */
  description?: React.ReactNode;
  /** Trailing actions — usually a Button or two. Right-aligned on wide screens. */
  actions?: React.ReactNode;
  /** Heading level. Default 2. Set to 3/4 when nested inside another section. */
  level?: 2 | 3 | 4;
}

/**
 * A section title within a page — lighter-weight than ResourceHeader. Pairs a
 * title with an optional description and a right-aligned action cluster.
 * Use to delineate logical sections inside a single page (e.g. "Billing",
 * "Team members", "Notifications" on a settings page).
 */
export const SectionHeader = React.forwardRef<HTMLElement, SectionHeaderProps>(
  ({ title, description, actions, level = 2, className, ...props }, ref) => {
    const Heading = `h${level}` as 'h2' | 'h3' | 'h4';
    return (
      <header
        ref={ref}
        className={cn('mizu-section-header', className)}
        data-component="mizu-section-header"
        {...props}
      >
        <div className="mizu-section-header__text">
          <Heading className="mizu-section-header__title">{title}</Heading>
          {description ? <p className="mizu-section-header__description">{description}</p> : null}
        </div>
        {actions ? <div className="mizu-section-header__actions">{actions}</div> : null}
      </header>
    );
  },
);
SectionHeader.displayName = 'SectionHeader';
