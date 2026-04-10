export type ControlSectionProps = {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  className?: string;
  headerAction?: React.ReactNode;
};

export type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  label: string;
  name?: string;
};

export type SliderInputProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  unit?: string;
};

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';
