import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeEditorState } from '@/types/editor';
import { defaultThemeState } from '@/config/theme';
import { getPresetThemeStyles } from '@/utils/theme-preset-helper';

const MAX_HISTORY_COUNT = 30;
const HISTORY_OVERRIDE_THRESHOLD_MS = 500;

interface ThemeHistoryEntry {
  state: ThemeEditorState;
  timestamp: number;
}

function isDeepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

interface EditorStore {
  themeState: ThemeEditorState;
  themeCheckpoint: ThemeEditorState | null;
  history: ThemeHistoryEntry[];
  future: ThemeHistoryEntry[];
  setThemeState: (state: ThemeEditorState) => void;
  applyThemePreset: (preset: string) => void;
  saveThemeCheckpoint: () => void;
  restoreThemeCheckpoint: () => void;
  resetToCurrentPreset: () => void;
  hasUnsavedChanges: () => boolean;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      themeState: defaultThemeState,
      themeCheckpoint: null,
      history: [],
      future: [],

      setThemeState: (newState: ThemeEditorState) => {
        const oldState = get().themeState;
        let currentHistory = get().history;
        const currentTime = Date.now();

        const lastEntry =
          currentHistory.length > 0 ? currentHistory[currentHistory.length - 1] : null;

        if (!lastEntry || currentTime - lastEntry.timestamp >= HISTORY_OVERRIDE_THRESHOLD_MS) {
          currentHistory = [...currentHistory, { state: oldState, timestamp: currentTime }];
        }

        if (currentHistory.length > MAX_HISTORY_COUNT) {
          currentHistory.shift();
        }

        set({
          themeState: newState,
          history: currentHistory,
          future: [],
        });
      },

      applyThemePreset: (preset: string) => {
        const currentState = get().themeState;
        const oldHistory = get().history;
        const currentTime = Date.now();

        const newStyles = getPresetThemeStyles(preset);
        const newState: ThemeEditorState = {
          preset,
          styles: newStyles,
          currentMode: currentState.currentMode,
        };

        const entry = { state: currentState, timestamp: currentTime };
        let updatedHistory = [...oldHistory, entry];
        if (updatedHistory.length > MAX_HISTORY_COUNT) {
          updatedHistory.shift();
        }

        set({
          themeState: newState,
          themeCheckpoint: newState,
          history: updatedHistory,
          future: [],
        });
      },

      saveThemeCheckpoint: () => {
        set({ themeCheckpoint: get().themeState });
      },

      restoreThemeCheckpoint: () => {
        const checkpoint = get().themeCheckpoint;
        if (!checkpoint) return;

        const oldState = get().themeState;
        const oldHistory = get().history;
        const currentTime = Date.now();

        const entry = { state: oldState, timestamp: currentTime };
        let updatedHistory = [...oldHistory, entry];
        if (updatedHistory.length > MAX_HISTORY_COUNT) {
          updatedHistory.shift();
        }

        set({
          themeState: checkpoint,
          history: updatedHistory,
          future: [],
        });
      },

      hasUnsavedChanges: () => {
        const state = get().themeState;
        const presetStyles = getPresetThemeStyles(state.preset ?? 'default');
        return !isDeepEqual(state.styles, presetStyles);
      },

      resetToCurrentPreset: () => {
        const currentState = get().themeState;
        const presetStyles = getPresetThemeStyles(currentState.preset ?? 'default');
        const newState: ThemeEditorState = {
          ...currentState,
          styles: presetStyles,
        };
        set({
          themeState: newState,
          themeCheckpoint: newState,
          history: [],
          future: [],
        });
      },

      undo: () => {
        const history = get().history;
        if (history.length === 0) return;

        const currentState = get().themeState;
        const future = get().future;
        const lastEntry = history[history.length - 1];

        set({
          themeState: lastEntry.state,
          themeCheckpoint: lastEntry.state,
          history: history.slice(0, -1),
          future: [{ state: currentState, timestamp: Date.now() }, ...future],
        });
      },

      redo: () => {
        const future = get().future;
        if (future.length === 0) return;

        const history = get().history;
        const currentState = get().themeState;
        const firstEntry = future[0];

        let updatedHistory = [...history, { state: currentState, timestamp: Date.now() }];
        if (updatedHistory.length > MAX_HISTORY_COUNT) {
          updatedHistory.shift();
        }

        set({
          themeState: firstEntry.state,
          themeCheckpoint: firstEntry.state,
          history: updatedHistory,
          future: future.slice(1),
        });
      },

      canUndo: () => get().history.length > 0,
      canRedo: () => get().future.length > 0,
    }),
    {
      name: 'tweakmizu-editor-storage',
    },
  ),
);
