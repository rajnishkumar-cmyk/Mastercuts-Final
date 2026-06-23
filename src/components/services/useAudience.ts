import { useCallback, useSyncExternalStore } from 'react';
import type { ServiceAudience } from '@/lib/booking/types';

const STORAGE_KEY = 'ra.audience';
const DEFAULT: ServiceAudience = 'ladies';

function parse(raw: string | null): ServiceAudience | null {
  if (raw === 'ladies' || raw === 'gentlemen' || raw === 'unisex') return raw;
  return null;
}

function read(): ServiceAudience {
  if (typeof window === 'undefined') return DEFAULT;
  return parse(window.localStorage.getItem(STORAGE_KEY)) ?? DEFAULT;
}

// ──────────────────────────────────────────────────────────────────────────
// Shared external store. Every `useAudience()` consumer reads from this single
// source of truth and re-renders together. A plain per-component useState would
// NOT sync within the same tab — the `storage` event only fires in *other*
// tabs — so toggling the audience in one component (e.g. the Ra-at-Home filter)
// would leave sibling components (e.g. ServiceCard's image picker) stale.
// ──────────────────────────────────────────────────────────────────────────
let current: ServiceAudience = read();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

// Cross-tab sync: when another tab changes the stored audience, mirror it here.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return;
    const next = parse(e.newValue);
    if (next && next !== current) {
      current = next;
      emit();
    }
  });
}

function setAudienceGlobal(next: ServiceAudience) {
  if (next === current) return;
  current = next;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, next);
  }
  emit();
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): ServiceAudience {
  return current;
}

function getServerSnapshot(): ServiceAudience {
  return DEFAULT;
}

export function useAudience(): [ServiceAudience, (next: ServiceAudience) => void] {
  const audience = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const update = useCallback((next: ServiceAudience) => setAudienceGlobal(next), []);
  return [audience, update];
}
