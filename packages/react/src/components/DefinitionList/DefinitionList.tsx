import * as React from 'react';
import { cn } from '../../utils/cn';

export type DefinitionListOrientation = 'horizontal' | 'vertical';

export interface DefinitionListItem {
  label: React.ReactNode;
  value: React.ReactNode;
  key?: string;
}

export interface DefinitionListProps extends Omit<
  React.HTMLAttributes<HTMLDListElement>,
  'children'
> {
  items?: DefinitionListItem[];
  orientation?: DefinitionListOrientation;
  columns?: 1 | 2 | 3;
  children?: React.ReactNode;
}

export const DefinitionList = React.forwardRef<HTMLDListElement, DefinitionListProps>(
  ({ className, items, orientation = 'horizontal', columns = 1, children, ...props }, ref) => (
    <dl
      ref={ref}
      className={cn('mizu-definition-list', className)}
      data-component="mizu-definition-list"
      data-orientation={orientation}
      data-columns={columns > 1 ? columns : undefined}
      {...props}
    >
      {items?.map((item, index) => {
        const useItemWrapper = orientation === 'vertical' || columns > 1;
        const dtdd = (
          <>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </>
        );
        if (useItemWrapper) {
          return (
            <div key={item.key ?? index} className="mizu-definition-list__item">
              {dtdd}
            </div>
          );
        }
        return (
          <React.Fragment key={item.key ?? index}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </React.Fragment>
        );
      })}
      {children}
    </dl>
  ),
);
DefinitionList.displayName = 'DefinitionList';
