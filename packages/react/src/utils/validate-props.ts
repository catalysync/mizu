import { useEffect } from 'react';

export function useValidateProps(validator: () => void, deps: React.DependencyList = []): void {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      validator();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
