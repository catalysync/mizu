import * as React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, ...props }, ref) => (
    <div
      ref={ref}
      data-component="mizu-card"
      className={cn('mizu-card', interactive && 'mizu-card--interactive', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, children, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-card__header', className)} {...props}>
      {title && <h3 className="mizu-card__title">{title}</h3>}
      {description && <p className="mizu-card__description">{description}</p>}
      {children}
    </div>
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-card__body', className)} {...props} />
  ),
);
CardBody.displayName = 'CardBody';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-card__footer', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';
