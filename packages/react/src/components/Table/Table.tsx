import * as React from 'react';
import { cn } from '../../utils/cn';

export type TableDensity = 'compact' | 'default' | 'comfortable';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Applied to the scroll wrapper, not the `<table>`. Ref and style follow the same rule. */
  className?: string;
  style?: React.CSSProperties;
  density?: TableDensity;
  stickyHeader?: boolean;
  striped?: boolean;
  bordered?: boolean;
  stickyFirstColumn?: boolean;
}

export const Table = React.forwardRef<HTMLDivElement, TableProps>(
  (
    {
      className,
      style,
      density = 'default',
      stickyHeader,
      striped,
      bordered,
      stickyFirstColumn,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn('mizu-table-wrapper', className)} style={style}>
        <table
          data-component="mizu-table"
          className={cn(
            'mizu-table',
            stickyHeader && 'mizu-table--sticky',
            striped && 'mizu-table--striped',
            bordered && 'mizu-table--bordered',
            stickyFirstColumn && 'mizu-table--sticky-first',
          )}
          data-density={density === 'default' ? undefined : density}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  },
);
Table.displayName = 'Table';

/** The `<thead>` section. */
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => <thead ref={ref} className={cn(className)} {...props} />);
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => <tbody ref={ref} className={cn(className)} {...props} />);
TableBody.displayName = 'TableBody';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, onClick, ...props }, ref) => {
    /* When a row has an onClick (or the consumer passes role="button"), it's
     * semantically interactive. Surface a data attribute so CSS can attach
     * cursor + hover affordance without each consumer hand-rolling them. */
    const interactive = !!onClick || props.role === 'button';

    return (
      <tr
        ref={ref}
        className={cn(className)}
        data-selected={selected || undefined}
        data-clickable={interactive || undefined}
        onClick={onClick}
        {...props}
      />
    );
  },
);
TableRow.displayName = 'TableRow';

/** A `<th>` header cell. */
export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => <th ref={ref} className={cn(className)} {...props} />);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => <td ref={ref} className={cn(className)} {...props} />);
TableCell.displayName = 'TableCell';

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => <caption ref={ref} className={cn(className)} {...props} />);
TableCaption.displayName = 'TableCaption';
