import { NumberInput, type NumberInputProps } from '@aspect/react';
import * as React from 'react';

export interface TaxRateInputProps extends Omit<
  NumberInputProps,
  'suffix' | 'min' | 'max' | 'step' | 'precision'
> {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
}

export const TaxRateInput = React.forwardRef<HTMLInputElement, TaxRateInputProps>(
  (
    { min = 0, max = 100, step = 0.25, precision = 2, align = 'end', inputClassName, ...rest },
    ref,
  ) => (
    <NumberInput
      ref={ref}
      suffix="%"
      min={min}
      max={max}
      step={step}
      precision={precision}
      align={align}
      inputClassName={`${inputClassName ?? ''} mizu-tax-rate-input__input`.trim()}
      data-component="mizu-tax-rate-input"
      {...rest}
    />
  ),
);
TaxRateInput.displayName = 'TaxRateInput';
