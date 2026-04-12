'use client';

import { createContext, useContext } from 'react';

const CraftProContext = createContext(false);

export function CraftProProvider({
  isPro,
  children,
}: {
  isPro: boolean;
  children: React.ReactNode;
}) {
  return <CraftProContext.Provider value={isPro}>{children}</CraftProContext.Provider>;
}

export function useIsPro(): boolean {
  return useContext(CraftProContext);
}
