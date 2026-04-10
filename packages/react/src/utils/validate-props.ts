import { useEffect } from 'react';

declare const __DEV__: boolean;

const isDev =
  typeof __DEV__ !== 'undefined'
    ? __DEV__
    : typeof globalThis !== 'undefined' &&
      'process' in globalThis &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).process?.env?.NODE_ENV !== 'production';

export function useValidateProps(validator: () => void, deps: React.DependencyList = []): void {
  useEffect(() => {
    if (isDev) validator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
