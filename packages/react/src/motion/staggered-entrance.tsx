import * as React from 'react';
import { durations, type MotionDuration } from './durations';
import { useIsReducedMotion } from './use-reduced-motion';

export interface StaggeredEntranceProps {
  children: React.ReactNode;
  stagger?: number;
  duration?: MotionDuration;
}

export function StaggeredEntrance({
  children,
  stagger = 50,
  duration = 'normal',
}: StaggeredEntranceProps) {
  const reduced = useIsReducedMotion();
  const ms = reduced ? 0 : durations[duration];

  return (
    <>
      {React.Children.map(children, (child, i) => {
        if (!React.isValidElement(child)) return child;
        return (
          <div
            style={{
              opacity: 0,
              animation: `mizu-fade-in-up ${ms}ms cubic-bezier(0, 0, 0.2, 1) ${i * stagger}ms forwards`,
            }}
          >
            {child}
          </div>
        );
      })}
    </>
  );
}
