import { useCallback, useRef, useState } from 'react';

export type FocusColorId = string;

interface ColorControlFocusState {
  registerColor: (name: string, element: HTMLElement | null) => void;
  unregisterColor: (name: string) => void;
  highlightTarget: string | null;
  focusColor: (name: FocusColorId) => void;
}

export function useColorControlFocus(): ColorControlFocusState {
  const [highlightTarget] = useState<string | null>(null);
  const elementsRef = useRef<Map<string, HTMLElement | null>>(new Map());

  const registerColor = useCallback((name: string, element: HTMLElement | null) => {
    elementsRef.current.set(name, element);
  }, []);

  const unregisterColor = useCallback((name: string) => {
    elementsRef.current.delete(name);
  }, []);

  const focusColor = useCallback((_name: FocusColorId) => {
    // no-op stub
  }, []);

  return {
    registerColor,
    unregisterColor,
    highlightTarget,
    focusColor,
  };
}
