import type { Plan } from '@/lib/studio/composer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlansStore {
  plans: Record<string, Plan>;
  savePlan: (plan: Plan) => void;
  getPlan: (id: string) => Plan | undefined;
  deletePlan: (id: string) => void;
  listPlans: () => Plan[];
}

export const usePlansStore = create<PlansStore>()(
  persist(
    (set, get) => ({
      plans: {},

      savePlan: (plan) => {
        set((state) => ({
          plans: { ...state.plans, [plan.id]: plan },
        }));
      },

      getPlan: (id) => get().plans[id],

      deletePlan: (id) => {
        set((state) => {
          const next = { ...state.plans };
          delete next[id];
          return { plans: next };
        });
      },

      listPlans: () => {
        const values = Object.values(get().plans);
        return values.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      },
    }),
    {
      name: 'tweakmizu-plans-storage',
    },
  ),
);
