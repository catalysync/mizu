export type MotionDuration = 'none' | 'fast' | 'normal' | 'slow';

export const durations: Record<MotionDuration, number> = {
  none: 0,
  fast: 150,
  normal: 300,
  slow: 600,
};

const EXIT_MULTIPLIER = 0.5;

export const exitDurations: Record<MotionDuration, number> = {
  none: 0,
  fast: durations.fast * EXIT_MULTIPLIER,
  normal: durations.normal * EXIT_MULTIPLIER,
  slow: durations.slow * EXIT_MULTIPLIER,
};
