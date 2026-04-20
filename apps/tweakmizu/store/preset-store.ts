import { ThemePreset } from '@/types/theme';
import { defaultPresets } from '@/utils/theme-presets';
import { create } from 'zustand';

interface ThemePresetStore {
  presets: Record<string, ThemePreset>;
  getPreset: (name: string) => ThemePreset | undefined;
  getAllPresets: () => Record<string, ThemePreset>;
}

export const useThemePresetStore = create<ThemePresetStore>()((_, get) => ({
  presets: defaultPresets,
  getPreset: (name: string) => get().presets[name],
  getAllPresets: () => get().presets,
}));
