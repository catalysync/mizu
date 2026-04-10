import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ColorFormat } from '@/types';

export type ColorSelectorTab = 'list' | 'palette';
export type TailwindVersion = '3' | '4';
export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

interface PreferencesState {
  colorFormat: ColorFormat;
  setColorFormat: (format: ColorFormat) => void;
  colorSelectorTab: ColorSelectorTab;
  setColorSelectorTab: (tab: ColorSelectorTab) => void;
  tailwindVersion: TailwindVersion;
  setTailwindVersion: (version: TailwindVersion) => void;
  packageManager: PackageManager;
  setPackageManager: (pm: PackageManager) => void;
  getAvailableColorFormats: () => ColorFormat[];
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      colorFormat: 'oklch' as ColorFormat,
      setColorFormat: (format) => set({ colorFormat: format }),
      colorSelectorTab: 'list' as ColorSelectorTab,
      setColorSelectorTab: (tab) => set({ colorSelectorTab: tab }),
      tailwindVersion: '4' as TailwindVersion,
      setTailwindVersion: (version) => set({ tailwindVersion: version }),
      packageManager: 'pnpm' as PackageManager,
      setPackageManager: (pm) => set({ packageManager: pm }),
      getAvailableColorFormats: () => {
        const tw = get().tailwindVersion;
        if (tw === '4') return ['oklch', 'hsl', 'hex', 'rgb'] as ColorFormat[];
        return ['hsl', 'hex', 'rgb', 'oklch'] as ColorFormat[];
      },
    }),
    {
      name: 'tweakmizu-preferences',
    },
  ),
);
