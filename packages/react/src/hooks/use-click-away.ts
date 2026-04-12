import { useEffect, type RefObject } from 'react';

/**
 * useClickAway — fires callback when a click occurs outside the ref element.
 * Useful for closing custom dropdowns, popovers, and modals.
 */
export function useClickAway(
  ref: RefObject<HTMLElement | null>,
  callback: (event: MouseEvent | TouchEvent) => void,
) {
  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      callback(event);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [ref, callback]);
}
