import * as React from 'react';
import { useFieldContext, useFieldControlProps } from '../components/Field/field-context';

// Structural copy of react-hook-form's FieldState. Typed here instead of imported so
// the emitted .d.ts does not depend on react-hook-form being installed.
export interface FormFieldState {
  invalid?: boolean;
  error?: { message?: string } | undefined;
}

export interface UseFormFieldOptions {
  fieldState: FormFieldState;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  'aria-describedby'?: string;
}

export interface UseFormFieldResult<T extends HTMLElement> {
  // Spread onto the control: id, aria-invalid, aria-describedby, required, disabled.
  controlProps: React.HTMLAttributes<T> & {
    id?: string;
    required?: boolean;
    disabled?: boolean;
    'aria-invalid'?: true;
  };
  invalid: boolean;
  errorMessage: string | undefined;
  // Put this id on the element that renders the message. Inside <Field>, pass the message
  // to Field's errorMessage instead: Field renders it and this id is its own.
  errorId: string | undefined;
}

// Binds a react-hook-form field's validation state to its control. The control gets
// aria-invalid, and aria-describedby points at the error message, so screen readers
// announce the error when the field is focused.
export function useFormField<T extends HTMLElement>(
  options: UseFormFieldOptions,
): UseFormFieldResult<T> {
  const { fieldState, id, required, disabled } = options;
  const baseId = React.useId();
  const ctx = useFieldContext();
  const invalid = fieldState.invalid === true || fieldState.error != null;
  const errorMessage = fieldState.error?.message || undefined;
  // Inside <Field>, Field renders the message and owns its id (ctx.errorId), and
  // useFieldControlProps adds that id itself. Only mint an id when no Field renders it.
  const ownErrorId = !ctx && invalid && errorMessage ? `${baseId}-error` : undefined;
  const errorId = ctx ? ctx.errorId : ownErrorId;

  const describedBy =
    [options['aria-describedby'], ownErrorId].filter(Boolean).join(' ') || undefined;

  const resolved = useFieldControlProps<T>({
    id,
    required,
    disabled,
    'aria-invalid': invalid ? true : undefined,
    'aria-describedby': describedBy,
  });

  // Drop undefined keys so spreading controlProps after register() or an id prop does
  // not overwrite them with undefined.
  const controlProps = Object.fromEntries(
    Object.entries(resolved).filter(([, value]) => value !== undefined),
  ) as UseFormFieldResult<T>['controlProps'];

  return { controlProps, invalid, errorMessage, errorId };
}
