import * as React from 'react';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
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
    const resolvedId = id ?? ctx?.controlId;
    const resolvedRequired = required ?? ctx?.required;
    const resolvedDisabled = disabled ?? ctx?.disabled;
    const resolvedInvalid = ariaInvalidProp ?? (ctx?.invalid || undefined);
    const resolvedDescribedBy =
      [ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp].filter(Boolean).join(' ') ||
      undefined;

    return (
      <textarea
        ref={ref}
        id={resolvedId}
        required={resolvedRequired}
        disabled={resolvedDisabled}
        aria-invalid={resolvedInvalid}
        aria-describedby={resolvedDescribedBy}
        data-component="mizu-textarea"
        className={cn('mizu-textarea', className)}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
