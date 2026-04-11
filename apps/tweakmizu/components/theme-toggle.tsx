'use client';

import { Button } from '@aspect/react';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function ThemeToggle({ size = 'icon' }: ThemeToggleProps) {
  const { scheme, toggle, mounted } = useDarkMode();

  // Don't render the icon state until we're mounted — avoids a hydration mismatch
  // between the server (always light) and a client that may have resolved to dark.
  const label = mounted
    ? scheme === 'dark'
      ? 'Switch to light mode'
      : 'Switch to dark mode'
    : 'Toggle theme';

  return (
    <Button variant="ghost" size={size} onClick={toggle} aria-label={label}>
      {mounted && scheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}
