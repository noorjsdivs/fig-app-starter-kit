import { BOOKING_STATUS, STATUS } from '@/data/seed';
import type { BookingStatus, OrderStep } from '@/data/types';
import type { Palette } from '@/theme/tokens';

/** `STCOL` — New/Preparing/On the way/Delivered/Cancelled. */
export function orderStatus(step: OrderStep, c: Palette): { label: string; color: string } {
  const colors = [c.info, c.warn, c.accentText, c.ok, c.err];
  return { label: STATUS[step], color: colors[step] };
}

/** `BCOL` — Booked/Seated/Cancelled. */
export function bookingStatus(status: BookingStatus, c: Palette): { label: string; color: string } {
  const colors = [c.info, c.ok, c.err];
  return { label: BOOKING_STATUS[status], color: colors[status] };
}
