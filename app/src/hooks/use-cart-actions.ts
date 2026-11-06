import type { RefObject } from 'react';
import type { HostInstance } from 'react-native';

import { useFlyToCart } from '@/components/ui/overlays';
import { defaultSize } from '@/data/menu';
import type { CartLine } from '@/data/types';
import { useApp } from '@/store/app-store';

/** Adds a line to the cart and, on success, flies the “+1” bubble from `ref` to the cart. */
export function useAddToCart() {
  const fly = useFlyToCart();
  return (line: CartLine, ref?: RefObject<HostInstance | null> | null, target: 'tab' | 'header' = 'tab') => {
    const ok = useApp.getState().addToCart(line);
    if (ok) fly(ref, target);
    return ok;
  };
}

/** One-tap “+” from a card: default size, no extras, qty 1. */
export function useQuickAdd() {
  const add = useAddToCart();
  return (dishId: string, ref?: RefObject<HostInstance | null> | null, opts?: { deal?: boolean; target?: 'tab' | 'header' }) => {
    const d = useApp.getState().dishOf(dishId);
    return add({ id: dishId, s: defaultSize(d.cat), ex: [], q: 1, ...(opts?.deal ? { deal: true } : {}) }, ref, opts?.target ?? 'tab');
  };
}
