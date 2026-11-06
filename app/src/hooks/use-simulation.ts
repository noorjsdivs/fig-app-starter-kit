import { usePathname } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { useApp } from '@/store/app-store';

/**
 * Drives the demo "live kitchen" exactly like the prototype's 1s ticker:
 * every 10s open tickets age by a minute, every 8s a live customer order
 * advances a step (with inbox entry + toast).
 */
export function useSimulation() {
  const pathname = usePathname();
  const path = useRef(pathname);
  useEffect(() => {
    path.current = pathname;
  }, [pathname]);

  useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      const p = path.current ?? '';
      useApp.getState().tick(n, { inAdmin: p.startsWith('/admin'), onTrack: p.startsWith('/track') });
    }, 1000);
    return () => clearInterval(id);
  }, []);
}

/** A 1-second clock for countdowns (Deal of the day). */
export function useNow(active = true): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}
