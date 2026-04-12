import { useEffect, useState } from 'react';

/**
 * useDebounce — returns a debounced version of the value. The returned
 * value only updates after the source value has been stable for `delay` ms.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
