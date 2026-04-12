'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DesignLanguageProfile,
  mizuSampleProfile,
  type DesignLanguageProfile as Profile,
} from '@/lib/craft/profile';
import { archetypeById } from '@/lib/craft/archetypes';

interface CraftState {
  profile: Profile;
  hasOnboarded: boolean;
  hasHydrated: boolean;
  history: Profile[];
  future: Profile[];

  pickArchetype: (id: string) => void;
  updateCluster: <K extends ClusterKey>(cluster: K, patch: Partial<Profile[K]>) => void;
  resetToDefault: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  importProfile: (input: unknown) => { ok: boolean; error?: string };
  exportProfile: () => Profile;
}

type ClusterKey =
  | 'foundation'
  | 'shape'
  | 'density'
  | 'type'
  | 'motion'
  | 'depth'
  | 'focus'
  | 'iconography'
  | 'voice'
  | 'opinions';

const HISTORY_LIMIT = 50;

function pushHistory(history: Profile[], snapshot: Profile): Profile[] {
  const next = [...history, snapshot];
  return next.length > HISTORY_LIMIT ? next.slice(-HISTORY_LIMIT) : next;
}

export const useCraftStore = create<CraftState>()(
  persist(
    (set, get) => ({
      profile: mizuSampleProfile,
      hasOnboarded: false,
      hasHydrated: false,
      history: [],
      future: [],

      pickArchetype: (id) => {
        const arch = archetypeById(id);
        if (!arch) return;
        const prev = get().profile;
        set({
          profile: arch.profile,
          hasOnboarded: true,
          history: pushHistory(get().history, prev),
          future: [],
        });
      },

      updateCluster: (cluster, patch) => {
        const prev = get().profile;
        set({
          profile: {
            ...prev,
            [cluster]: { ...prev[cluster], ...patch },
          },
          history: pushHistory(get().history, prev),
          future: [],
        });
      },

      resetToDefault: () => {
        const prev = get().profile;
        set({
          profile: mizuSampleProfile,
          history: pushHistory(get().history, prev),
          future: [],
        });
      },

      undo: () => {
        const { history, profile } = get();
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        set({
          profile: prev,
          history: history.slice(0, -1),
          future: [profile, ...get().future],
        });
      },

      redo: () => {
        const { future, profile } = get();
        if (future.length === 0) return;
        const next = future[0];
        set({
          profile: next,
          history: [...get().history, profile],
          future: future.slice(1),
        });
      },

      canUndo: () => get().history.length > 0,
      canRedo: () => get().future.length > 0,

      importProfile: (input) => {
        const result = DesignLanguageProfile.safeParse(input);
        if (!result.success) {
          return { ok: false, error: result.error.message };
        }
        const prev = get().profile;
        set({
          profile: result.data,
          hasOnboarded: true,
          history: pushHistory(get().history, prev),
          future: [],
        });
        return { ok: true };
      },

      exportProfile: () => get().profile,
    }),
    {
      name: 'tweakmizu-craft-storage',
      version: 2,
      partialize: (state) => ({
        profile: state.profile,
        hasOnboarded: state.hasOnboarded,
      }),
      onRehydrateStorage: () => {
        return (_state: unknown, error?: unknown) => {
          // Set hydrated regardless of success/failure
          useCraftStore.setState({ hasHydrated: true });
        };
      },
      migrate: (persisted, version) => {
        const data = JSON.parse(JSON.stringify(persisted));
        if (version < 2) {
          const profile = data.profile as Record<string, unknown> | undefined;
          if (profile) {
            if (!profile.app) profile.app = mizuSampleProfile.app;
            const app = profile.app as Record<string, unknown>;
            if (!app.identity) app.identity = mizuSampleProfile.app.identity;
            if (!app.pages) app.pages = mizuSampleProfile.app.pages;
            if (!app.entities) app.entities = mizuSampleProfile.app.entities;
            if (!app.shell) app.shell = mizuSampleProfile.app.shell;
            if (!app.components) app.components = mizuSampleProfile.app.components;
            if (!app.customComponents)
              app.customComponents = mizuSampleProfile.app.customComponents;
          }
        }
        return data as CraftState;
      },
    },
  ),
);
