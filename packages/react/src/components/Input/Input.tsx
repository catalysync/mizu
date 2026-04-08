import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const inputVariants = cva('mizu-input', {
  variants: {
    size: {
      sm: 'mizu-input--sm',
      md: '',
      lg: 'mizu-input--lg',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, type = 'text', ...props }, ref) => (
    <input ref={ref} type={type} className={cn(inputVariants({ size, className }))} {...props} />
  ),
);
Input.displayName = 'Input';
