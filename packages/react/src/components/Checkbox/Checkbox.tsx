import * as RadixCheckbox from '@radix-ui/react-checkbox';
import * as React from 'react';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root> {
  label?: string;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(
  (
    {
      className,
      label,
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

    const localId = id || (label ? `cb-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const checkboxId = localId ?? ctx?.controlId;
    const resolvedRequired = required ?? ctx?.required;
    const resolvedDisabled = disabled ?? ctx?.disabled;
    const resolvedInvalid = ariaInvalidProp ?? (ctx?.invalid || undefined);
    const resolvedDescribedBy =
      [ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp].filter(Boolean).join(' ') ||
      undefined;

    const checkbox = (
      <RadixCheckbox.Root
        ref={ref}
        id={checkboxId}
        required={resolvedRequired}
        disabled={resolvedDisabled}
        aria-invalid={resolvedInvalid}
        aria-describedby={resolvedDescribedBy}
        data-component="mizu-checkbox"
        className={cn('mizu-checkbox', className)}
        {...props}
      >
        <RadixCheckbox.Indicator className="mizu-checkbox__indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            width="12"
            height="12"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
    );

    if (!label) return checkbox;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mizu-spacing-2)' }}>
        {checkbox}
        <label htmlFor={checkboxId} className="mizu-body--sm" style={{ cursor: 'pointer' }}>
          {label}
        </label>
      </div>
    );
  },
);
Checkbox.displayName = 'Checkbox';
