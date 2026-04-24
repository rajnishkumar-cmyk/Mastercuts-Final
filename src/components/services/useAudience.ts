import { useCallback, useEffect, useState } from 'react';
import type { ServiceAudience } from '@/lib/booking/types';

const STORAGE_KEY = 'ra.audience';
const DEFAULT: ServiceAudience = 'ladies';

function read(): ServiceAudience {
  if (typeof window === 'undefined') return DEFAULT;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === 'ladies' || raw === 'gentlemen' || raw === 'unisex') return raw;
  return DEFAULT;
}

export function useAudience(): [ServiceAudience, (next: ServiceAudience) => void] {
  const [audience, setAudience] = useState<ServiceAudience>(read);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        if (e.newValue === 'ladies' || e.newValue === 'gentlemen' || e.newValue === 'unisex') {
          setAudience(e.newValue);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback((next: ServiceAudience) => {
    setAudience(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  return [audience, update];
}
