import { defaultStyles } from '@/config/theme';
import { ThemeStyleProps } from '@/types/theme';
import { useThemePresetStore } from '@/store/preset-store';

/**
 * Merge a preset's partial overrides with the default mizu tokens,
 * returning a fully resolved ThemeStyleProps.
 */
function mergePresetWithDefaults(overrides: Partial<ThemeStyleProps>): ThemeStyleProps {
  return {
    ...defaultStyles,
    ...overrides,
  };
}

export function getPresetThemeStyles(name: string): ThemeStyleProps {
  if (name === 'default') {
    return defaultStyles;
  }

  const store = useThemePresetStore.getState();
  const preset = store.getPreset(name);
  if (!preset) {
    return defaultStyles;
  }

  return mergePresetWithDefaults(preset.styles);
}
