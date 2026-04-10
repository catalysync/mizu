import * as React from 'react';
import { durations, type MotionDuration } from './durations';
import { useIsReducedMotion } from './use-reduced-motion';

export interface ZoomInProps {
  children: React.ReactNode;
  duration?: MotionDuration;
}

export function ZoomIn({ children, duration = 'fast' }: ZoomInProps) {
  const reduced = useIsReducedMotion();
  const ms = reduced ? 0 : durations[duration];
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? 'scale(1)' : 'scale(0.95)',
        transition:
          ms > 0
            ? `opacity ${ms}ms cubic-bezier(0, 0, 0.2, 1), transform ${ms}ms cubic-bezier(0, 0, 0.2, 1)`
            : 'none',
      }}
    >
      {children}
    </div>
  );
}
