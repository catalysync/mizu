import { useEffect } from 'react';

export interface UseCommandMenuShortcutOptions {
  /** Current open state of the CommandMenu. */
  open: boolean;
  /** Called with the next open state when the shortcut is pressed. */
  onOpenChange: (open: boolean) => void;
  /** Set to false to stop listening, e.g. while another modal owns the keyboard. */
  enabled?: boolean;
}

/**
 * Toggles a CommandMenu on Cmd+K (macOS) or Ctrl+K (everywhere else).
 * Listens on `window` so it works regardless of focus, and ignores Alt/Shift
 * combinations so it does not swallow other shortcuts.
 */
export function useCommandMenuShortcut({
  open,
  onOpenChange,
  enabled = true,
}: UseCommandMenuShortcutOptions): void {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k') return;
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
      if (event.defaultPrevented || event.isComposing) return;

      event.preventDefault();
      onOpenChange(!open);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, open, onOpenChange]);
}
