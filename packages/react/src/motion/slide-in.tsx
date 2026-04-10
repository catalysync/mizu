import * as React from 'react';
import { durations, type MotionDuration } from './durations';
import { useIsReducedMotion } from './use-reduced-motion';

export interface SlideInProps {
  children: React.ReactNode;
  duration?: MotionDuration;
  from: 'left' | 'right' | 'top' | 'bottom';
}

const transforms: Record<SlideInProps['from'], string> = {
  left: 'translateX(-100%)',
  right: 'translateX(100%)',
  top: 'translateY(-100%)',
  bottom: 'translateY(100%)',
};

export function SlideIn({ children, duration = 'normal', from }: SlideInProps) {
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
        transform: entered ? 'translate(0)' : transforms[from],
        transition: ms > 0 ? `transform ${ms}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none',
      }}
    >
      {children}
    </div>
  );
}
