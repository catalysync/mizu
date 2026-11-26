import type { ReactNode } from 'react';
import type { ButtonProps } from '../Button';

export type ToastTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface ToastOptions {
  /** Stable id. Calling `toast()` again with the same id replaces that entry instead of adding a second one. */
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  actions?: ButtonProps[];
}

export interface ToastItem extends ToastOptions {
  id: string;
}

// Replaced on every change so `useSyncExternalStore` sees a new snapshot only when the queue changes.
let items: readonly ToastItem[] = [];
let nextId = 0;
const listeners = new Set<() => void>();

function commit(next: readonly ToastItem[]) {
  items = next;
  listeners.forEach((listener) => listener());
}

/** Adds a toast to the queue, or replaces the one with the same id. Returns its id. */
export function toast(options: ToastOptions): string {
  const id = options.id ?? `mizu-toast-${++nextId}`;
  const item: ToastItem = { ...options, id };
  const exists = items.some((existing) => existing.id === id);
  commit(
    exists ? items.map((existing) => (existing.id === id ? item : existing)) : [...items, item],
  );
  return id;
}

export function dismissToast(id: string): void {
  if (!items.some((existing) => existing.id === id)) return;
  commit(items.filter((existing) => existing.id !== id));
}

export function subscribeToasts(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToastsSnapshot(): readonly ToastItem[] {
  return items;
}
