import * as React from 'react';
import { cn } from '../../utils/cn';

export type TableDensity = 'compact' | 'default' | 'comfortable';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  density?: TableDensity;
  stickyHeader?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, density = 'default', stickyHeader, children, ...props }, ref) => (
    <div className="mizu-table-wrapper">
      <table
        ref={ref}
        data-component="mizu-table"
        className={cn('mizu-table', stickyHeader && 'mizu-table--sticky', className)}
        data-density={density === 'default' ? undefined : density}
        {...props}
      >
        {children}
      </table>
    </div>
  ),
);
Table.displayName = 'Table';

export const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => <thead ref={ref} className={cn(className)} {...props} />);
TableHead.displayName = 'TableHead';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => <tbody ref={ref} className={cn(className)} {...props} />);
TableBody.displayName = 'TableBody';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => (
    <tr ref={ref} className={cn(className)} data-selected={selected || undefined} {...props} />
  ),
);
TableRow.displayName = 'TableRow';

export const TableHeader = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => <th ref={ref} className={cn(className)} {...props} />);
TableHeader.displayName = 'TableHeader';

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
