import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  type PanelGroupProps,
  type PanelProps,
  type PanelResizeHandleProps,
} from 'react-resizable-panels';
import { cn } from '../utils/cn';

export interface ResizableGroupProps extends Omit<PanelGroupProps, 'direction'> {
  /** Panel layout direction. Default: "horizontal" */
  direction?: 'horizontal' | 'vertical';
}

export function ResizableGroup({
  className,
  direction = 'horizontal',
  ...props
}: ResizableGroupProps) {
  return (
    <PanelGroup
      direction={direction}
      className={cn('mizu-resizable-group', className)}
      {...props}
    />
  );
}

export function ResizablePanel({ className, ...props }: PanelProps) {
  return <Panel className={cn('mizu-resizable-panel', className)} {...props} />;
}

export function ResizableHandle({ className, ...props }: PanelResizeHandleProps) {
  return <PanelResizeHandle className={cn('mizu-resizable-handle', className)} {...props} />;
}
