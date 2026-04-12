import * as React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';

export const Switch = React.forwardRef<
  React.ElementRef<typeof RadixSwitch.Root>,
  React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>
>(
  (
    {
      className,
      id,
      required,
      disabled,
      'aria-invalid': ariaInvalidProp,
      'aria-describedby': ariaDescribedByProp,
      ...props
    },
    ref,
  ) => {
    const ctx = useFieldContext();
    const resolvedDescribedBy =
      [ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp].filter(Boolean).join(' ') ||
      undefined;
    return (
      <RadixSwitch.Root
        ref={ref}
        id={id ?? ctx?.controlId}
        required={required ?? ctx?.required}
        disabled={disabled ?? ctx?.disabled}
        aria-invalid={ariaInvalidProp ?? (ctx?.invalid || undefined)}
        aria-describedby={resolvedDescribedBy}
        data-component="mizu-switch"
        className={cn('mizu-switch', className)}
        {...props}
      >
        <RadixSwitch.Thumb className="mizu-switch__thumb" />
      </RadixSwitch.Root>
    );
  },
);
Switch.displayName = 'Switch';
