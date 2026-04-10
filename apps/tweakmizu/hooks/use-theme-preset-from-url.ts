import { useEffect } from 'react';
import { useEditorStore } from '@/store/editor-store';

/**
 * Reads a theme preset from the URL search params and applies it.
 * E.g., ?theme=my-preset will load and apply that preset on mount.
 */
export function useThemePresetFromUrl() {
  const applyThemePreset = useEditorStore((s) => s.applyThemePreset);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const preset = params.get('theme');
    if (preset) {
      applyThemePreset(preset);
    }
  }, [applyThemePreset]);
}
