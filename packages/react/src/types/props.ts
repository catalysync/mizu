export interface ControlledValueProps<T> {
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
}

export interface ActionProps {
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
}
