'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'tweakmizu-theme';

type ColorScheme = 'light' | 'dark';

function readInitial(): ColorScheme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function apply(scheme: ColorScheme) {
  if (typeof document === 'undefined') return;
  if (scheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function useDarkMode() {
  const [scheme, setScheme] = useState<ColorScheme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = readInitial();
    setScheme(initial);
    apply(initial);
    setMounted(true);
  }, []);

  const setMode = (next: ColorScheme) => {
    setScheme(next);
    apply(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage blocked (private mode / quota) — fall through
    }
  };

  const toggle = () => setMode(scheme === 'dark' ? 'light' : 'dark');

  return { scheme, toggle, setMode, mounted };
}
