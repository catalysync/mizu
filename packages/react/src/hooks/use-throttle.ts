import { useCallback, useRef } from 'react';

/**
 * useThrottle — returns a throttled version of the callback. The callback
 * fires at most once per `delay` ms. Trailing call is always fired.
 */
export function useThrottle<T extends (...args: unknown[]) => void>(callback: T, delay: number): T {
  const lastCall = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    ((...args: unknown[]) => {
      const now = Date.now();
      const remaining = delay - (now - lastCall.current);

      if (remaining <= 0) {
        if (timer.current) clearTimeout(timer.current);
        lastCall.current = now;
        callback(...args);
      } else if (!timer.current) {
        timer.current = setTimeout(() => {
          lastCall.current = Date.now();
          timer.current = null;
          callback(...args);
        }, remaining);
      }
    }) as T,
    [callback, delay],
  );
}
