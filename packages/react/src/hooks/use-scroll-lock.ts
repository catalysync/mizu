import { useEffect, useRef } from 'react';

/**
 * useScrollLock — locks body scroll when active. Supports stacking: if
 * multiple consumers lock simultaneously (nested modals), body stays locked
 * until ALL unlock. Uses a ref-counted global counter.
 */

let lockCount = 0;
let originalOverflow: string | null = null;

function lock() {
  lockCount++;
  if (lockCount === 1 && typeof document !== 'undefined') {
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0 && typeof document !== 'undefined') {
    document.body.style.overflow = originalOverflow ?? '';
    originalOverflow = null;
  }
}

export function useScrollLock(active: boolean) {
  const wasActive = useRef(false);
  useEffect(() => {
    if (active && !wasActive.current) {
      lock();
      wasActive.current = true;
    }
    if (!active && wasActive.current) {
      unlock();
      wasActive.current = false;
    }
    return () => {
      if (wasActive.current) {
        unlock();
        wasActive.current = false;
      }
    };
  }, [active]);
}
