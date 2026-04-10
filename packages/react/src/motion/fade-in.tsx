import * as React from 'react';
import { durations, type MotionDuration } from './durations';
import { useIsReducedMotion } from './use-reduced-motion';

export interface FadeInProps {
  children: React.ReactNode;
  duration?: MotionDuration;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: string;
}

export function FadeIn({
  children,
  duration = 'normal',
  direction,
  distance = '0.5rem',
}: FadeInProps) {
  const reduced = useIsReducedMotion();
  const ms = reduced ? 0 : durations[duration];

  const translateMap = {
    up: `translateY(${distance})`,
    down: `translateY(-${distance})`,
    left: `translateX(${distance})`,
    right: `translateX(-${distance})`,
  };

  const from: React.CSSProperties = {
    opacity: 0,
    transform: direction ? translateMap[direction] : undefined,
  };

  const to: React.CSSProperties = {
    opacity: 1,
    transform: direction ? 'translate(0)' : undefined,
  };

  const [style, setStyle] = React.useState<React.CSSProperties>(from);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setStyle(to));
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        ...style,
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
