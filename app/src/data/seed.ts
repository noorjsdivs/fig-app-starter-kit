import { unitOf } from '@/lib/pricing';

import { MENU } from './menu';
import type { Address, Booking, Card, CartLine, Customer, IconName, InboxItem, Order, OrderStep, PayOption, Promo, Review } from './types';

export const CUSTOMERS: Customer[] = (
  [
    ['c1', 'Alex Morgan', 'alex.morgan@mail.com', '221 Mercer St, Apt 4B', '+1 (212) 555‑0142', 'Regular'],
    ['c2', 'Priya Nair', 'priya.nair@mail.com', '14 Bleecker St', '+1 (212) 555‑0118', 'VIP'],
    ['c3', 'Diego Alvarez', 'diego.a@mail.com', '300 Lafayette St', '+1 (917) 555‑0190', 'Regular'],
    ['c4', 'Hannah Wolfe', 'hannah.w@mail.com', '52 Prince St', '+1 (646) 555‑0127', 'New'],
    ['c5', 'Marcus Bell', 'marcus.bell@mail.com', '8 Spring St', '+1 (212) 555‑0173', 'VIP'],
    ['c6', 'Sofia Ramirez', 'sofia.r@mail.com', '190 Mott St', '+1 (917) 555‑0151', 'Regular'],
  ] as const
).map(([id, name, email, addr, phone, tier]) => ({ id, name, email, addr, phone, tier }));

/** The signed-in demo customer. */
export const ME = CUSTOMERS[0];
export const DEMO_USER = { name: ME.name, email: ME.email, phone: ME.phone };

const dish = (id: string) => MENU.find((m) => m.id === id) ?? MENU[0];

type SeedOrder = [no: string, cid: string, time: string, step: OrderStep, items: [string, number, number][], pay: string];

const SEED_ORDER_ROWS: SeedOrder[] = [
  [
    'EK-4821',
    'c2',
    '7:12 PM',
    0,
    [
      ['pep', 1, 1],
      ['wings', 0, 1],
    ],
    'Apple Pay',
  ],
  ['EK-4819', 'c3', '7:05 PM', 0, [['smash', 0, 2]], 'Visa •••• 4242'],
  [
    'EK-4816',
    'c4',
    '6:58 PM',
    1,
    [
      ['carb', 0, 1],
      ['cheesecake', 0, 1],
    ],
    'Apple Pay',
  ],
  [
    'EK-4812',
    'c5',
    '6:47 PM',
    1,
    [
      ['marg', 2, 1],
      ['fries', 0, 1],
    ],
    'Cash',
  ],
  ['EK-4807', 'c6', '6:31 PM', 2, [['handi', 0, 1]], 'Visa •••• 1007'],
  [
    'EK-4799',
    'c1',
    'Yesterday',
    3,
    [
      ['brisket', 0, 1],
      ['gateau', 0, 1],
    ],
    'Apple Pay',
  ],
  ['EK-4790', 'c2', 'Yesterday', 3, [['ramen', 1, 2]], 'Apple Pay'],
  ['EK-4781', 'c3', 'Mon', 4, [['lasagne', 0, 1]], 'Visa •••• 4242'],
];
const SEED_MINS = [4, 7, 11, 16, 24, 0, 0, 0];

export const SEED_ORDERS: Order[] = SEED_ORDER_ROWS.map(([no, cid, time, step, rows, pay], i) => {
  const items: CartLine[] = rows.map(([id, s, q]) => ({ id, s, ex: [], q }));
  const sub = items.reduce((a, it) => a + unitOf(dish(it.id), it.s, it.ex) * it.q, 0);
  return { no, cid, time, step, items, pay, total: sub + (sub >= 40 ? 0 : 2.99), live: false, mins: SEED_MINS[i], mode: 'delivery' };
});

export const SEED_PROMOS: Promo[] = [
  { code: 'FIG10', pct: 10, used: 342, on: true },
  { code: 'WEEKNIGHT15', pct: 15, used: 128, on: true },
  { code: 'LUNCH20', pct: 20, used: 500, on: false },
];

export const SEED_REVIEWS: Review[] = [
  { name: 'Priya Nair', stars: 5, text: 'The hot honey pepperoni is unreal. Arrived piping hot.', dish: 'Hot Honey Pepperoni', time: '2h ago', replied: false },
  { name: 'Marcus Bell', stars: 4, text: 'Great brisket burger, fries could be crispier.', dish: 'Smoked Brisket Burger', time: 'Yesterday', replied: true },
  { name: 'Hannah Wolfe', stars: 5, text: 'Best carbonara in SoHo. Ordering again Friday.', dish: 'Spaghetti Carbonara', time: '2d ago', replied: false },
  { name: 'Diego Alvarez', stars: 3, text: 'Tasty but took 45 minutes on a rainy night.', dish: 'Wood‑Oven Lasagne', time: '3d ago', replied: false },
];

export const SEED_BOOKINGS: Booking[] = [
  { id: 'b1', name: 'Sofia Ramirez', party: 2, time: '6:00', seat: 'Patio', status: 0, day: 0 },
  { id: 'b2', name: 'The Chen family', party: 5, time: '6:30', seat: 'Dining room', status: 0, day: 0 },
  { id: 'b3', name: 'Jordan Lee', party: 2, time: '7:00', seat: 'Chef’s counter', status: 1, day: 0 },
  { id: 'b4', name: 'Ava Patel', party: 4, time: '7:30', seat: 'Dining room', status: 0, day: 0 },
  { id: 'b5', name: 'Noah Kim', party: 3, time: '8:30', seat: 'Patio', status: 0, day: 0 },
];

export const SEED_INBOX: InboxItem[] = [
  { id: 'n1', icon: 'sell', title: 'Weeknight deal: 15% off', sub: 'Use WEEKNIGHT15 at checkout before Thursday.', time: '2h', unread: true },
  { id: 'n2', icon: 'eco', title: 'Truffle Funghi is here', sub: 'Roasted wild mushrooms and taleggio. Fired to order.', time: '5h', unread: true },
  { id: 'n3', icon: 'check_circle', title: 'EK‑4799 delivered', sub: 'How was your Smoked Brisket Burger? Leave a rating.', time: 'Yesterday', unread: false },
  { id: 'n4', icon: 'event_seat', title: 'Patio seating is open', sub: 'Book a table for tonight from 5:30 PM.', time: 'Mon', unread: false },
];

export const SEED_CARDS: Card[] = [
  { id: 'k1', brand: 'VISA', num: '•••• 4242', exp: '08/28', bg: ['#1A1F71', '#3B3FA8'], nick: 'Everyday', name: 'ALEX MORGAN' },
  { id: 'k2', brand: 'MASTERCARD', num: '•••• 8810', exp: '02/27', bg: ['#262626', '#6B6B6B'], nick: 'Work card', name: 'ALEX MORGAN' },
];

export const SEED_ADDRESSES: Address[] = [
  { tag: 'Home', icon: 'home', l1: '221 Mercer St, Apt 4B', l2: 'New York, NY 10012', note: 'Buzzer 4B, leave with doorman', door: true },
  { tag: 'Work', icon: 'work', l1: '85 Broad St, Floor 12', l2: 'New York, NY 10004', note: 'Reception desk, ask for Alex', door: false },
];

export const PAY_OPTIONS: PayOption[] = [
  { t: 'Apple Pay', s: 'Default · Face ID', icon: 'phone_iphone' },
  { t: 'Visa •••• 4242', s: 'Expires 08/28', icon: 'credit_card' },
  { t: 'Cash on delivery', s: 'Pay the courier', icon: 'payments' },
];

/** Admin dashboard — sales by hour. */
export const HOURS: [string, number][] = [
  ['5p', 420],
  ['6p', 980],
  ['7p', 1460],
  ['8p', 1240],
  ['9p', 760],
  ['10p', 310],
];

export const STATUS = ['New', 'Preparing', 'On the way', 'Delivered', 'Cancelled'] as const;
export const BOOKING_STATUS = ['Booked', 'Seated', 'Cancelled'] as const;

/** Detects card brand + gradient from the leading digits (`brandOf`). */
export function cardBrandOf(digits: string): { name: string; bg: readonly [string, string] } {
  if (digits.startsWith('4')) return { name: 'VISA', bg: ['#1A1F71', '#3B3FA8'] };
  if (/^(5[1-5]|2[2-7])/.test(digits)) return { name: 'MASTERCARD', bg: ['#262626', '#6B6B6B'] };
  if (/^3[47]/.test(digits)) return { name: 'AMEX', bg: ['#0E6E5C', '#2FA383'] };
  if (/^6/.test(digits)) return { name: 'DISCOVER', bg: ['#C2540A', '#FF7A1A'] };
  return { name: 'CARD', bg: ['#333333', '#55575B'] };
}

export const addressIconFor = (tag: string): IconName => (tag === 'Work' ? 'work' : tag === 'Home' ? 'home' : 'location_on');
