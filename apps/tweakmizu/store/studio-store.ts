import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultThemeState } from '@/config/theme';
import { defaultStudioExtensions } from '@/config/studio';
import type { StudioThemeState, StudioThemeExtensions } from '@/types/studio';
import type { ThemeStyleProps } from '@/types/theme';

const MAX_HISTORY_COUNT = 30;
const HISTORY_OVERRIDE_THRESHOLD_MS = 500;

interface StudioHistoryEntry {
  state: StudioThemeState;
  timestamp: number;
}

const initialState: StudioThemeState = {
  ...defaultThemeState,
  extensions: defaultStudioExtensions,
};

interface StudioStore {
  studioState: StudioThemeState;
  studioCheckpoint: StudioThemeState | null;
  history: StudioHistoryEntry[];
  future: StudioHistoryEntry[];
  setStudioState: (state: StudioThemeState) => void;
  setStyles: (updates: Partial<ThemeStyleProps>) => void;
  setExtensions: (updater: (prev: StudioThemeExtensions) => StudioThemeExtensions) => void;
  saveCheckpoint: () => void;
  restoreCheckpoint: () => void;
  resetExtensions: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useStudioStore = create<StudioStore>()(
  persist(
    (set, get) => ({
      studioState: initialState,
      studioCheckpoint: null,
      history: [],
      future: [],

      setStudioState: (newState) => {
        const prev = get().studioState;
        const now = Date.now();
        let history = get().history;
        const last = history.length > 0 ? history[history.length - 1] : null;

        if (!last || now - last.timestamp >= HISTORY_OVERRIDE_THRESHOLD_MS) {
          history = [...history, { state: prev, timestamp: now }];
        }

        if (history.length > MAX_HISTORY_COUNT) {
          history.shift();
        }

        set({ studioState: newState, history, future: [] });
      },

      setStyles: (updates) => {
        const prev = get().studioState;
        get().setStudioState({
          ...prev,
          styles: { ...prev.styles, ...updates },
        });
      },

      setExtensions: (updater) => {
        const prev = get().studioState;
        get().setStudioState({
          ...prev,
          extensions: updater(prev.extensions),
        });
      },

      saveCheckpoint: () => set({ studioCheckpoint: get().studioState }),

      restoreCheckpoint: () => {
        const checkpoint = get().studioCheckpoint;
        if (!checkpoint) return;
        const prev = get().studioState;
        const now = Date.now();
        let history = [...get().history, { state: prev, timestamp: now }];
        if (history.length > MAX_HISTORY_COUNT) history.shift();
        set({ studioState: checkpoint, history, future: [] });
      },

      resetExtensions: () => {
        const prev = get().studioState;
        get().setStudioState({
          ...prev,
          extensions: defaultStudioExtensions,
        });
      },

      undo: () => {
        const history = get().history;
        if (history.length === 0) return;
        const current = get().studioState;
        const last = history[history.length - 1];
        set({
          studioState: last.state,
          studioCheckpoint: last.state,
          history: history.slice(0, -1),
          future: [{ state: current, timestamp: Date.now() }, ...get().future],
        });
      },

      redo: () => {
        const future = get().future;
        if (future.length === 0) return;
        const current = get().studioState;
        const first = future[0];
        let history = [...get().history, { state: current, timestamp: Date.now() }];
        if (history.length > MAX_HISTORY_COUNT) history.shift();
        set({
          studioState: first.state,
          studioCheckpoint: first.state,
          history,
          future: future.slice(1),
        });
      },

      canUndo: () => get().history.length > 0,
      canRedo: () => get().future.length > 0,
    }),
    {
      name: 'tweakmizu-studio-storage',
    },
  ),
);
