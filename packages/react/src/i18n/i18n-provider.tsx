import * as React from 'react';
import type { MizuLocale } from './locale';
import { enUS } from './locales/en-us';

const I18nContext = React.createContext<MizuLocale>(enUS);

export interface I18nProviderProps {
  locale: MizuLocale;
  children: React.ReactNode;
}

export const I18nProvider = ({ locale, children }: I18nProviderProps) => (
  <I18nContext.Provider value={locale}>{children}</I18nContext.Provider>
);
I18nProvider.displayName = 'I18nProvider';

export function useLocale(): MizuLocale {
  return React.useContext(I18nContext);
}
