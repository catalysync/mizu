export interface ControlledValueProps<T> {
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
}

export interface Action {
  content: string;
  onAction?: () => void;
}

export interface DisableableAction extends Action {
  disabled?: boolean;
}

export interface DestructableAction extends Action {
  destructive?: boolean;
}

export interface LoadableAction extends Action {
  loading?: boolean;
}

export interface ComplexAction extends DisableableAction, DestructableAction, LoadableAction {
  icon?: React.ReactNode;
}

export type Never<T> = { [P in keyof T]+?: never };
