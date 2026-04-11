import * as React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { cn } from '../../utils/cn';

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof RadixSlider.Root> {
  /** Accessible label; falls back to aria-label if not wrapped in a FormGroup */
  'aria-label'?: string;
}

const Slider = React.forwardRef<React.ElementRef<typeof RadixSlider.Root>, SliderProps>(
  ({ className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props }, ref) => {
    const values = Array.isArray(props.value)
      ? props.value
      : Array.isArray(props.defaultValue)
        ? props.defaultValue
        : [0];

    return (
      <RadixSlider.Root
        ref={ref}
        data-component="mizu-slider"
        className={cn('mizu-slider', className)}
        {...props}
      >
        <RadixSlider.Track className="mizu-slider__track">
          <RadixSlider.Range className="mizu-slider__range" />
        </RadixSlider.Track>
        {values.map((_, i) => (
          <RadixSlider.Thumb
            key={i}
            className="mizu-slider__thumb"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
          />
        ))}
      </RadixSlider.Root>
    );
  },
);
Slider.displayName = 'Slider';

export { Slider };
