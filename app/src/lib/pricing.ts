import { ALL_EXTRAS, extrasOf, sizesOf } from '@/data/menu';
import type { CartLine, Dish, FulfilmentMode, AppliedPromo } from '@/data/types';

export const SPEEDS = [
  { t: 'Standard', s: '25–35 min', fee: 0 },
  { t: 'Priority', s: '15–20 min', fee: 1.99 },
] as const;

/** Unit price of a dish with a size index and selected extras. */
export function unitOf(dish: Dish, sizeIndex: number, extras: string[]): number {
  const sizes = sizesOf(dish.cat);
  const size = sizes[sizeIndex] ?? sizes[0];
  const ex = extras.reduce((a, id) => a + (ALL_EXTRAS.find((x) => x.id === id)?.price ?? 0), 0);
  return dish.price + size.delta + ex;
}

/** Unit price of a cart line, applying any deal/reward discount. */
export function lineUnit(line: CartLine, dish: Dish): number {
  const base = unitOf(dish, line.s, line.ex);
  return line.deal ? base * (1 - (line.dealPct ?? 0) / 100) : base;
}

/** Human summary of a line's options, e.g. `12" · Calabrian chili oil`. */
export function lineMeta(line: CartLine, dish: Dish): string {
  const size = sizesOf(dish.cat)[line.s]?.label ?? '';
  const ex = line.ex.map((id) => ALL_EXTRAS.find((x) => x.id === id)?.label ?? '');
  return [size, ...ex].filter(Boolean).join(' · ');
}

export interface Totals {
  sub: number;
  count: number;
  fee: number;
  speedFee: number;
  disc: number;
  /** Total shown on the cart (excludes priority fee). */
  cartTotal: number;
  /** Total charged at checkout. */
  total: number;
}

export function computeTotals(args: {
  cart: CartLine[];
  dishOf: (id: string) => Dish;
  mode: FulfilmentMode;
  speed: number;
  fee: number;
  freeAt: number;
  promo: AppliedPromo | null;
}): Totals {
  const { cart, dishOf, mode, speed, fee: baseFee, freeAt, promo } = args;
  const sub = cart.reduce((a, c) => a + lineUnit(c, dishOf(c.id)) * c.q, 0);
  const count = cart.reduce((a, c) => a + c.q, 0);
  const pickup = mode === 'pickup';
  const fee = pickup || sub === 0 || sub >= freeAt ? 0 : baseFee;
  const speedFee = pickup ? 0 : (SPEEDS[speed]?.fee ?? 0);
  const disc = promo ? (sub * promo.pct) / 100 : 0;
  return { sub, count, fee, speedFee, disc, cartTotal: sub + fee - disc, total: sub + fee + speedFee - disc };
}

export { extrasOf, sizesOf };
