import type { IconName } from '@/components/icons/glyphs';

export type { IconName };

/** Two-stop gradient, rendered at 135deg (top-left → bottom-right). */
export type Gradient = readonly [string, string];

export type DishTag = '' | 'Bestseller' | 'New' | 'Spicy';
export type BadgeOption = 'None' | 'Bestseller' | 'New' | 'Spicy';

export interface Dish {
  id: string;
  name: string;
  cat: string;
  price: number;
  rating: number;
  reviews: number;
  /** Prep time in minutes. */
  time: number;
  kcal: number;
  img: string;
  tag: DishTag;
  desc: string;
  avail: boolean;
  brand: string;
}

export interface Category {
  name: string;
  on: boolean;
}

export interface Brand {
  id: string;
  name: string;
  tag: string;
  icon: IconName;
  img: string;
  on: boolean;
}

export interface SizeOption {
  label: string;
  /** Price delta vs. base price. */
  delta: number;
}

export interface Extra {
  id: string;
  label: string;
  price: number;
}

export interface Banner {
  id: string;
  /** Eyebrow label. */
  eb: string;
  title: string;
  cta: string;
  /** Target category, or 'All'. */
  cat?: string;
  /** Target dish id. */
  dish?: string;
  img: string;
  on: boolean;
}

export type HomeSectionKey = 'hero' | 'cats' | 'deal' | 'brands' | 'popular' | 'again' | 'reserve' | 'rated' | 'journal';

export interface HomeSection {
  k: HomeSectionKey;
  l: string;
  icon: IconName;
  on: boolean;
}

export interface Deal {
  id: string;
  pct: number;
  on: boolean;
}

export type PostCategory = 'Behind the pass' | 'Recipes' | 'Guides' | 'News';

export interface Post {
  id: string;
  title: string;
  cat: PostCategory;
  img: string;
  author: string;
  date: string;
  mins: number;
  featured: boolean;
  on: boolean;
  dish: string | null;
  likes: number;
  excerpt: string;
  body: string;
}

export interface CartLine {
  id: string;
  /** Size index. */
  s: number;
  /** Extra ids. */
  ex: string[];
  q: number;
  /** Bought through Deal of the day / a reward (discounted line). */
  deal?: boolean;
  dealPct?: number;
}

/** 0 New · 1 Preparing · 2 On the way · 3 Delivered · 4 Cancelled */
export type OrderStep = 0 | 1 | 2 | 3 | 4;
export type FulfilmentMode = 'delivery' | 'pickup';

export interface Order {
  no: string;
  cid: string;
  time: string;
  step: OrderStep;
  items: CartLine[];
  pay: string;
  total: number;
  /** Driven forward by the live simulation. */
  live: boolean;
  /** Minutes since the ticket was fired (kitchen display). */
  mins: number;
  mode: FulfilmentMode;
  rated?: number;
}

export type CustomerTier = 'Regular' | 'VIP' | 'New';

export interface Customer {
  id: string;
  name: string;
  email: string;
  addr: string;
  phone: string;
  tier: CustomerTier;
}

export interface Address {
  tag: string;
  icon: IconName;
  l1: string;
  l2: string;
  note: string;
  door: boolean;
  phone?: string;
}

export interface PayOption {
  t: string;
  s: string;
  icon: IconName;
}

export interface Speed {
  t: string;
  s: string;
  fee: number;
}

export interface Card {
  id: string;
  brand: string;
  num: string;
  exp: string;
  bg: Gradient;
  nick: string;
  name: string;
}

export interface Promo {
  code: string;
  pct: number;
  used: number;
  on: boolean;
}

export interface AppliedPromo {
  code: string;
  pct: number;
}

export interface Review {
  name: string;
  stars: number;
  text: string;
  dish: string;
  time: string;
  replied: boolean;
}

/** 0 Booked · 1 Seated · 2 Cancelled */
export type BookingStatus = 0 | 1 | 2;

export interface Booking {
  id: string;
  name: string;
  party: number;
  time: string;
  seat: string;
  status: BookingStatus;
  /** Day offset from today (0 = tonight). */
  day: number;
  code?: string;
  occ?: string | null;
  req?: string;
  mine?: boolean;
}

export interface InboxItem {
  id: string;
  icon: IconName;
  title: string;
  sub: string;
  time: string;
  unread: boolean;
}

export interface Reward {
  id: string;
  l: string;
  pts: number;
  dish?: string;
  s?: number;
  credit?: number;
}

export interface Faq {
  id: string;
  topic: string;
  q: string;
  a: string;
}

export interface SeatArea {
  l: string;
  note: string;
  cap: string;
  icon: IconName;
  img: string;
}

export interface OnboardingSlide {
  img: string;
  l0: string;
  l1: string;
  sub: string;
  icon: IconName;
  t: string;
  d: string;
  bg: Gradient;
  fg: string;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
}

export interface Prefs {
  lang: 'English' | 'Español' | 'Français';
  orderNotif: boolean;
  offers: boolean;
  journalNotif: boolean;
  sms: boolean;
  location: boolean;
  personal: boolean;
}

export interface MenuFilters {
  /** Index into SORTS. */
  sort: number;
  veg: boolean;
  hot: boolean;
  under: boolean;
}
