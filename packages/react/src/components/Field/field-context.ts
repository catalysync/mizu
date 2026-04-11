import * as React from 'react';

export interface FieldContextValue {
  controlId: string;
  descriptionId?: string;
  errorId?: string;
  required: boolean;
  disabled: boolean;
  invalid: boolean;
}

export const FieldContext = React.createContext<FieldContextValue | null>(null);

export function useFieldContext(): FieldContextValue | null {
  return React.useContext(FieldContext);
}

export function useFieldControlProps<T extends HTMLElement>(props: {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  required?: boolean;
  disabled?: boolean;
}): React.HTMLAttributes<T> & {
  id?: string;
  required?: boolean;
  disabled?: boolean;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
} {
  const ctx = useFieldContext();
  if (!ctx) return props;

  const describedBy =
    [ctx.descriptionId, ctx.errorId, props['aria-describedby']].filter(Boolean).join(' ') ||
    undefined;

  return {
    ...props,
    id: props.id ?? ctx.controlId,
    required: props.required ?? ctx.required,
    disabled: props.disabled ?? ctx.disabled,
    'aria-invalid': props['aria-invalid'] ?? (ctx.invalid || undefined),
    'aria-describedby': describedBy,
  };
}
