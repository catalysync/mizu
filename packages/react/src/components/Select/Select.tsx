import * as Sel from '@radix-ui/react-select';
import * as React from 'react';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';

export const Select = Sel.Root;
export const SelectGroup = Sel.Group;
export const SelectValue = Sel.Value;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof Sel.Trigger>,
  React.ComponentPropsWithoutRef<typeof Sel.Trigger>
>(
  (
    {
      className,
      children,
      id,
      disabled,
      'aria-invalid': ariaInvalidProp,
      'aria-describedby': ariaDescribedByProp,
      ...props
    },
    ref,
  ) => {
    const ctx = useFieldContext();
    const resolvedId = id ?? ctx?.controlId;
    const resolvedDisabled = disabled ?? ctx?.disabled;
    const resolvedInvalid = ariaInvalidProp ?? (ctx?.invalid || undefined);
    const resolvedDescribedBy =
      [ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp].filter(Boolean).join(' ') ||
      undefined;

    return (
      <Sel.Trigger
        ref={ref}
        id={resolvedId}
        disabled={resolvedDisabled}
        aria-invalid={resolvedInvalid}
        aria-describedby={resolvedDescribedBy}
        aria-required={ctx?.required || undefined}
        data-component="mizu-select"
        className={cn('mizu-select__trigger', className)}
        {...props}
      >
        {children}
        <Sel.Icon className="mizu-select__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="14"
            height="14"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Sel.Icon>
      </Sel.Trigger>
    );
  },
);
SelectTrigger.displayName = 'SelectTrigger';

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof Sel.Content>,
  React.ComponentPropsWithoutRef<typeof Sel.Content>
>(({ className, position = 'popper', sideOffset = 6, ...props }, ref) => (
  <Sel.Portal>
    <Sel.Content
      ref={ref}
      className={cn('mizu-select__content', className)}
      position={position}
      sideOffset={sideOffset}
      {...props}
    />
  </Sel.Portal>
));
SelectContent.displayName = 'SelectContent';

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof Sel.Item>,
  React.ComponentPropsWithoutRef<typeof Sel.Item>
>(({ className, children, ...props }, ref) => (
  <Sel.Item ref={ref} className={cn('mizu-select__item', className)} {...props}>
    <Sel.ItemText>{children}</Sel.ItemText>
  </Sel.Item>
));
SelectItem.displayName = 'SelectItem';

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof Sel.Label>,
  React.ComponentPropsWithoutRef<typeof Sel.Label>
>(({ className, ...props }, ref) => (
  <Sel.Label ref={ref} className={cn('mizu-select__label', className)} {...props} />
));
SelectLabel.displayName = 'SelectLabel';

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof Sel.Separator>,
  React.ComponentPropsWithoutRef<typeof Sel.Separator>
>(({ className, ...props }, ref) => (
  <Sel.Separator ref={ref} className={cn('mizu-select__separator', className)} {...props} />
));
SelectSeparator.displayName = 'SelectSeparator';
