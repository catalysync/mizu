import { useEffect, useRef } from 'react';

/**
 * usePrevious — returns the value from the previous render. Useful for
 * diffing props or state across renders (e.g. detecting when a value
 * changed from X to Y).
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
