import * as React from 'react';
import { NumberInput, type NumberInputProps } from '@aspect/react';

export interface CurrencyInputProps extends Omit<
  NumberInputProps,
  'prefix' | 'precision' | 'step'
> {
  currency?: string;
  locale?: string;
  precision?: number;
  step?: number;
}

const symbolCache = new Map<string, string>();

function currencySymbol(currency: string, locale: string): string {
  const key = `${currency}-${locale}`;
  const cached = symbolCache.get(key);
  if (cached) return cached;
  const parts = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).formatToParts(0);
  const symbol = parts.find((p) => p.type === 'currency')?.value ?? currency;
  symbolCache.set(key, symbol);
  return symbol;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      currency = 'USD',
      locale = 'en-US',
      precision = 2,
      step = 0.01,
      align = 'end',
      inputClassName,
      ...rest
    },
    ref,
  ) => {
    const symbol = currencySymbol(currency, locale);
    return (
      <NumberInput
        ref={ref}
        prefix={symbol}
        precision={precision}
        step={step}
        align={align}
        inputClassName={`${inputClassName ?? ''} mizu-currency-input__input`.trim()}
        data-component="mizu-currency-input"
        data-currency={currency}
        {...rest}
      />
    );
  },
);
CurrencyInput.displayName = 'CurrencyInput';
