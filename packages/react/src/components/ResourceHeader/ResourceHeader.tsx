import * as React from 'react';
import { cn } from '../../utils/cn';

export interface ResourceHeaderMetaEntry {
  label: React.ReactNode;
  value: React.ReactNode;
}

export interface ResourceHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Primary title. Semantically an `<h1>`. */
  title: React.ReactNode;
  /** Optional subtitle rendered below the title. */
  subtitle?: React.ReactNode;
  /** Optional eyebrow rendered above the title (e.g. breadcrumbs or a resource type label). */
  eyebrow?: React.ReactNode;
  /** Optional status indicator — typically a `<Badge>` or `<Tag>`. Renders inline with the title. */
  status?: React.ReactNode;
  /** Optional action cluster — typically a group of `<Button>` elements. Right-aligned on wide screens. */
  actions?: React.ReactNode;
  /** Optional key/value metadata. Renders as a horizontal definition-list below the header. */
  meta?: ResourceHeaderMetaEntry[];
  /** Optional free-slot rendered after meta (tabs, filters, etc.). */
  footer?: React.ReactNode;
  /** Override the heading level. Defaults to 1 — appropriate when the header is the page's primary title. */
  level?: 1 | 2 | 3;
}

/**
 * Detail-page header. Composes an eyebrow / title / subtitle / status cluster with
 * an actions group and an optional meta row. Useful on resource detail pages (a
 * customer, an invoice, a product) where consumers need breadcrumbs + title +
 * actions + metadata without gluing a handful of primitives each time.
 */
export const ResourceHeader = React.forwardRef<HTMLElement, ResourceHeaderProps>(
  (
    { title, subtitle, eyebrow, status, actions, meta, footer, level = 1, className, ...props },
    ref,
  ) => {
    const Heading = `h${level}` as 'h1' | 'h2' | 'h3';
    return (
      <header
        ref={ref}
        className={cn('mizu-resource-header', className)}
        data-component="mizu-resource-header"
        {...props}
      >
        {eyebrow ? <div className="mizu-resource-header__eyebrow">{eyebrow}</div> : null}
        <div className="mizu-resource-header__row">
          <div className="mizu-resource-header__title-group">
            <div className="mizu-resource-header__title-line">
              <Heading className="mizu-resource-header__title">{title}</Heading>
              {status ? <span className="mizu-resource-header__status">{status}</span> : null}
            </div>
            {subtitle ? <p className="mizu-resource-header__subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="mizu-resource-header__actions">{actions}</div> : null}
        </div>
        {meta && meta.length > 0 ? (
          <dl className="mizu-resource-header__meta">
            {meta.map((entry, index) => (
              <div key={index} className="mizu-resource-header__meta-item">
                <dt className="mizu-resource-header__meta-label">{entry.label}</dt>
                <dd className="mizu-resource-header__meta-value">{entry.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {footer ? <div className="mizu-resource-header__footer">{footer}</div> : null}
      </header>
    );
  },
);
ResourceHeader.displayName = 'ResourceHeader';
