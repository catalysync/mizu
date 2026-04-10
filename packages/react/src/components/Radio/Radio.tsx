import * as React from 'react';
import * as RadixRadio from '@radix-ui/react-radio-group';
import { cn } from '../../utils/cn';

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadixRadio.Root>,
  React.ComponentPropsWithoutRef<typeof RadixRadio.Root>
>(({ className, ...props }, ref) => (
  <RadixRadio.Root ref={ref} className={cn('mizu-radio-group', className)} {...props} />
));
RadioGroup.displayName = 'RadioGroup';

export interface RadioItemProps extends React.ComponentPropsWithoutRef<typeof RadixRadio.Item> {
  label?: string;
}

export const RadioItem = React.forwardRef<React.ElementRef<typeof RadixRadio.Item>, RadioItemProps>(
  ({ className, label, id, value, ...props }, ref) => {
    const radioId = id || (label ? `radio-${value}` : undefined);

    const radio = (
      <RadixRadio.Item
        ref={ref}
        id={radioId}
        value={value}
        className={cn('mizu-radio-item', className)}
        {...props}
      >
        <RadixRadio.Indicator className="mizu-radio-indicator" />
      </RadixRadio.Item>
    );

    if (!label) return radio;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--mizu-spacing-2)' }}>
        {radio}
        <label htmlFor={radioId} className="mizu-body--sm" style={{ cursor: 'pointer' }}>
          {label}
        </label>
      </div>
    );
  },
);
RadioItem.displayName = 'RadioItem';
