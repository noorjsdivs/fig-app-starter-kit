import { router, useNavigationContainerRef } from 'expo-router';

import { useApp } from '@/store/app-store';

const AUTH = new Set(['login', 'register', 'forgot', 'verify']);
const KNOWN = new Set([...AUTH, 'index', '(tabs)', 'admin', 'checkout']);

interface NavState {
  index?: number;
  routes: { name: string; state?: NavState }[];
}

/** Finds the app's root Stack state inside the container state. */
function findRootStack(state: NavState | undefined): NavState | undefined {
  let s = state;
  for (let guard = 0; s && guard < 6; guard++) {
    if (s.routes.some((r) => KNOWN.has(r.name))) return s;
    s = s.routes[s.index ?? s.routes.length - 1]?.state;
  }
  return undefined;
}

/**
 * Leaves the auth flow. Auth screens either sit on top of the app (opened from
 * Profile / Cart / Reserve) or were entered straight from the splash.
 */
export function useAuthExit() {
  const nav = useNavigationContainerRef();
  return (opts?: { signedIn?: boolean }) => {
    const st = findRootStack(nav.getRootState() as unknown as NavState | undefined);
    const routes = st?.routes ?? [];
    let n = 0;
    for (let i = routes.length - 1; i >= 0 && AUTH.has(routes[i].name); i--) n++;
    const pending = useApp.getState().pendingCheckout;
    useApp.getState().setPendingCheckout(false);

    if (!routes.length || n >= routes.length) {
      // Came from the splash: the auth flow is the whole stack.
      if (router.canDismiss()) router.dismissAll();
      router.replace('/home');
    } else {
      router.dismiss(Math.max(1, n));
    }
    if (opts?.signedIn && pending && useApp.getState().cart.length) {
      setTimeout(() => {
        router.navigate('/cart');
        router.push('/checkout');
      }, 260);
    }
  };
}
