/**
 * Logger — centralized deprecation and warning messages. Deduplicates
 * so the same message only logs once per session (prevents noisy re-render
 * logs). Borrowed from sage-carbon's internal Logger pattern.
 */

const logged = new Set<string>();

function once(level: 'warn' | 'error', message: string) {
  if (logged.has(message)) return;
  logged.add(message);
  if (level === 'warn') console.warn(`[mizu] ${message}`);
  else console.error(`[mizu] ${message}`);
}

export const Logger = {
  deprecate(oldName: string, newName: string, version?: string) {
    const v = version ? ` It will be removed in ${version}.` : '';
    once('warn', `${oldName} is deprecated. Use ${newName} instead.${v}`);
  },
  warn(message: string) {
    once('warn', message);
  },
  error(message: string) {
    once('error', message);
  },
};
