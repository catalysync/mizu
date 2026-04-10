const isDev =
  typeof globalThis !== 'undefined' &&
  'process' in globalThis &&
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).process?.env?.NODE_ENV !== 'production';

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    if (isDev) {
      throw new Error(`[mizu] ${message}`);
    }
    throw new Error('[mizu] Invariant violation');
  }
}
