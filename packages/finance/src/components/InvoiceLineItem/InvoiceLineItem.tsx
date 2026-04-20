import { Input, Skeleton, cn } from '@aspect/react';
import * as React from 'react';
import { formatCurrency } from '../../utils/currency';
import { CurrencyInput } from '../CurrencyInput/CurrencyInput';
import { TaxRateInput } from '../TaxRateInput/TaxRateInput';

export interface InvoiceLineItemValue {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export interface InvoiceLineItemProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  value: InvoiceLineItemValue;
  currency?: string;
  locale?: string;
  onChange?: (value: InvoiceLineItemValue) => void;
  onRemove?: (id: string) => void;
  removable?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}

export function computeLineTotal(item: InvoiceLineItemValue): number {
  const subtotal = item.quantity * item.unitPrice;
  return subtotal * (1 + item.taxRate / 100);
}

export const InvoiceLineItem = React.forwardRef<HTMLDivElement, InvoiceLineItemProps>(
  (
    {
      className,
      value,
      currency = 'USD',
      locale = 'en-US',
      onChange,
      onRemove,
      removable = true,
      readOnly = false,
      loading,
      loadingLabel,
      ...props
    },
    ref,
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          role="status"
          className={cn('mizu-invoice-line-item', className)}
          data-component="mizu-invoice-line-item"
          aria-busy="true"
          aria-label={loadingLabel ?? 'Loading invoice line item'}
          {...props}
        >
          <div className="mizu-invoice-line-item__cell">
            <Skeleton height="2.25rem" />
          </div>
          <div className="mizu-invoice-line-item__cell" data-align="end">
            <Skeleton height="2.25rem" />
          </div>
          <div className="mizu-invoice-line-item__cell">
            <Skeleton height="2.25rem" />
          </div>
          <div className="mizu-invoice-line-item__cell">
            <Skeleton height="2.25rem" />
          </div>
          <div className="mizu-invoice-line-item__cell" data-align="end">
            <Skeleton variant="text" width="5rem" />
          </div>
          <div className="mizu-invoice-line-item__cell" />
        </div>
      );
    }

    const total = computeLineTotal(value);
    const update = (patch: Partial<InvoiceLineItemValue>) => {
      onChange?.({ ...value, ...patch });
    };
    return (
      <div
        ref={ref}
        className={cn('mizu-invoice-line-item', className)}
        data-component="mizu-invoice-line-item"
        {...props}
      >
        <div className="mizu-invoice-line-item__cell">
          <Input
            aria-label="Description"
            value={value.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Product or service"
            disabled={readOnly}
          />
        </div>
        <div className="mizu-invoice-line-item__cell" data-align="end">
          <Input
            type="number"
            aria-label="Quantity"
            value={value.quantity}
            onChange={(e) => update({ quantity: Number(e.target.value) || 0 })}
            min={0}
            disabled={readOnly}
          />
        </div>
        <div className="mizu-invoice-line-item__cell">
          <CurrencyInput
            aria-label="Unit price"
            value={value.unitPrice}
            onValueChange={(v) => update({ unitPrice: v ?? 0 })}
            currency={currency}
            locale={locale}
            disabled={readOnly}
            hideSteppers
          />
        </div>
        <div className="mizu-invoice-line-item__cell">
          <TaxRateInput
            aria-label="Tax rate"
            value={value.taxRate}
            onValueChange={(v) => update({ taxRate: v ?? 0 })}
            disabled={readOnly}
            hideSteppers
          />
        </div>
        <div className="mizu-invoice-line-item__cell" data-align="end">
          {formatCurrency(total, currency, locale)}
        </div>
        <div className="mizu-invoice-line-item__cell">
          {removable && !readOnly ? (
            <button
              type="button"
              className="mizu-invoice-line-item__remove"
              onClick={() => onRemove?.(value.id)}
              aria-label={`Remove ${value.description || 'line item'}`}
            >
              ×
            </button>
          ) : null}
        </div>
      </div>
    );
  },
);
InvoiceLineItem.displayName = 'InvoiceLineItem';
