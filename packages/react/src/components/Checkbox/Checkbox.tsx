import * as React from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root> {
  label?: string;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(({ className, label, id, ...props }, ref) => {
  const checkboxId = id || (label ? `cb-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const checkbox = (
    <RadixCheckbox.Root
      ref={ref}
      id={checkboxId}
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
});
Checkbox.displayName = 'Checkbox';
