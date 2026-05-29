import * as React from 'react';
import {
  Controller,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
  type UseFormStateReturn,
} from 'react-hook-form';

import { Field, type FieldProps } from '../Field/Field';

export interface FormFieldRenderArgs<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
> {
  field: ControllerRenderProps<TValues, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TValues>;
}

type InheritedFieldProps = Omit<FieldProps, 'children' | 'errorMessage' | 'htmlFor'>;

export interface FormFieldProps<
  TValues extends FieldValues = FieldValues,
  TName extends FieldPath<TValues> = FieldPath<TValues>,
> extends InheritedFieldProps {
  control: Control<TValues>;
  name: TName;
  rules?: Omit<
    RegisterOptions<TValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  shouldUnregister?: boolean;
  defaultValue?: ControllerRenderProps<TValues, TName>['value'];
  /**
   * Render the control. Receives RHF's `field` (`{ value, onChange, onBlur, name, ref }`)
   * which you spread onto a mizu input. The Field's `errorMessage` is sourced from
   * `fieldState.error?.message` automatically.
   */
  children: (args: FormFieldRenderArgs<TValues, TName>) => React.ReactNode;
}

export function FormField<
  TValues extends FieldValues = FieldValues,
  TName extends FieldPath<TValues> = FieldPath<TValues>,
>({
  control,
  name,
  rules,
  shouldUnregister,
  defaultValue,
  required,
  children,
  ...fieldProps
}: FormFieldProps<TValues, TName>) {
  const isRuleRequired = required ?? Boolean(rules?.required);
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      defaultValue={defaultValue}
      render={({ field, fieldState, formState }) => (
        <Field
          {...fieldProps}
          required={isRuleRequired}
          errorMessage={fieldState.error?.message}
          htmlFor={field.name}
        >
          {children({ field, fieldState, formState })}
        </Field>
      )}
    />
  );
}
FormField.displayName = 'FormField';
