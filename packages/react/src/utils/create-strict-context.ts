import * as React from 'react';

/**
 * createStrictContext — factory for compound component contexts. Returns a
 * typed [Provider, useHook] tuple. The hook throws a clear error when
 * consumed outside the Provider (unlike vanilla useContext which silently
 * returns undefined). Borrowed from sage-carbon's internal pattern.
 *
 * Usage:
 * ```ts
 * const [TabsProvider, useTabs] = createStrictContext<TabsContext>('Tabs');
 * ```
 */
export function createStrictContext<T>(
  name: string,
  defaultValue?: T,
): [React.Provider<T>, () => T] {
  const Context = React.createContext<T | undefined>(defaultValue);
  Context.displayName = name;

  function useStrictContext(): T {
    const value = React.useContext(Context);
    if (value === undefined) {
      throw new Error(
        `use${name} must be used within a <${name}Provider>. ` +
          `Wrap the consuming component tree in the provider.`,
      );
    }
    return value;
  }

  return [Context.Provider as React.Provider<T>, useStrictContext];
}
