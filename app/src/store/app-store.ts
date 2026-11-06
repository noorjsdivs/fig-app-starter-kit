import { create } from 'zustand';

import { CUSTOMER_STEPS, HERO, ISSUES, POSTS, SECTIONS } from '@/data/content';
import { BRANDS, CATS, MENU } from '@/data/menu';
import {
  addressIconFor,
  cardBrandOf,
  CUSTOMERS,
  DEMO_USER,
  PAY_OPTIONS,
  SEED_ADDRESSES,
  SEED_BOOKINGS,
  SEED_CARDS,
  SEED_INBOX,
  SEED_ORDERS,
  SEED_PROMOS,
  SEED_REVIEWS,
} from '@/data/seed';
import type {
  Address,
  AppliedPromo,
  Banner,
  Booking,
  BookingStatus,
  Brand,
  Card,
  CartLine,
  Category,
  Deal,
  Dish,
  FulfilmentMode,
  HomeSection,
  HomeSectionKey,
  IconName,
  InboxItem,
  MenuFilters,
  Order,
  OrderStep,
  Post,
  Prefs,
  Promo,
  Review,
  Reward,
  User,
} from '@/data/types';
import { cnt, money } from '@/lib/format';
import { computeTotals, type Totals } from '@/lib/pricing';
import { shortToday } from '@/lib/dates';

/* ------------------------------------------------------------------ types */

export type ThemePref = 'light' | 'dark' | 'system';

export interface ToastData {
  id: number;
  title: string;
  sub: string;
  icon: IconName;
  /** Optional action button: label + route to open. */
  action?: { label: string; href: string };
}

export interface FlyData {
  key: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export interface ItemDraft {
  id: string | null;
  name: string;
  price: number;
  cat: string;
  brand: string;
  tag: 'None' | 'Bestseller' | 'New' | 'Spicy';
  avail: boolean;
  img: string;
}

export interface NewAddress {
  tag: 'Home' | 'Work' | 'Other';
  custom: string;
  l1: string;
  apt: string;
  city: string;
  zip: string;
  note: string;
  door: boolean;
  phone: string;
  def: boolean;
}

export interface NewCard {
  num: string;
  name: string;
  exp: string;
  cvv: string;
  nick: string;
  def: boolean;
}

interface State {
  /* session */
  user: User | null;
  onboarded: boolean;
  /** Set when a guest tries to check out; after auth we jump to checkout. */
  pendingCheckout: boolean;
  theme: ThemePref;

  /* catalog (admin editable) */
  menu: Dish[];
  cats: Category[];
  brands: Brand[];
  banners: Banner[];
  secs: HomeSection[];
  deal: Deal;
  posts: Post[];
  promos: Promo[];

  /* store settings */
  storeOpen: boolean;
  prep: number;
  fee: number;
  freeAt: number;
  sound: boolean;

  /* customer */
  saved: string[];
  cart: CartLine[];
  mode: FulfilmentMode;
  promo: AppliedPromo | null;
  /** Promo field prefill (e.g. from a notification’s “Apply in cart”). */
  promoDraft: string;
  addrs: Address[];
  addr: number;
  speed: number;
  /** 0 Apple Pay · 1 default card · 2 cash */
  payM: number;
  note: string;
  cards: Card[];
  defCard: string;
  credit: number;
  points: number;
  redeemed: string[];
  orders: Order[];
  lastNo: string | null;
  inbox: InboxItem[];
  reviews: Review[];
  bookings: Booking[];
  liked: string[];
  prefs: Prefs;
  orderNotif: boolean;
  filters: MenuFilters;
  /** Selected menu category + brand filter (shared by Home → Menu jumps). */
  menuCat: string;
  menuBrand: string | null;

  /* kitchen display: checked items per order */
  kDone: Record<string, number[]>;

  /* transient ui */
  toast: ToastData | null;
  fly: FlyData | null;
  bump: number;
}

interface Actions {
  dishOf: (id: string) => Dish;
  totals: () => Totals;
  showToast: (title: string, sub: string, icon?: IconName, action?: ToastData['action']) => void;
  hideToast: () => void;
  flyToCart: (from: { x: number; y: number }, to: { x: number; y: number }) => void;
  endFly: () => void;

  setTheme: (t: ThemePref) => void;
  finishOnboarding: () => void;
  signIn: (u?: Partial<User>) => void;
  signOut: () => void;
  setPendingCheckout: (v: boolean) => void;
  updateProfile: (u: User) => void;

  setMenuCat: (cat: string, brand?: string | null) => void;
  setMenuBrand: (brand: string | null) => void;
  setFilters: (f: MenuFilters) => void;

  toggleSave: (id: string) => boolean;
  addToCart: (line: CartLine, opts?: { silent?: boolean }) => boolean;
  setQty: (index: number, delta: number) => void;
  reorder: (no: string) => void;
  setMode: (m: FulfilmentMode) => void;
  applyPromo: (code: string) => string | null;
  removePromo: () => void;
  setPromoDraft: (code: string) => void;
  setCheckout: (p: Partial<Pick<State, 'speed' | 'payM' | 'note' | 'addr'>>) => void;
  placeOrder: () => string | null;
  canCheckout: () => 'closed' | 'auth' | 'ok';

  addAddress: (a: NewAddress) => string | null;
  removeAddress: (i: number) => void;
  addCard: (c: NewCard) => string | null;
  removeCard: (id: string) => boolean;
  makeDefaultCard: (id: string) => void;
  addGiftCard: () => void;
  redeem: (r: Reward) => void;

  pushInbox: (icon: IconName, title: string, sub: string) => void;
  readNotif: (id: string) => void;
  readAllNotifs: () => void;
  deleteNotif: (id: string) => void;

  submitRating: (no: string, stars: number, tags: string[], text: string) => void;
  submitIssue: (no: string | null, type: number) => void;
  addBooking: (b: Omit<Booking, 'id' | 'code' | 'status' | 'mine' | 'name'>) => Booking | null;
  setBookingStatus: (id: string, status: BookingStatus) => void;
  toggleLike: (postId: string) => void;
  setPrefs: (p: Partial<Prefs>) => void;
  setOrderNotif: (v: boolean) => void;

  /* admin */
  setStore: (p: Partial<Pick<State, 'storeOpen' | 'prep' | 'fee' | 'freeAt' | 'sound'>>) => void;
  toggleStoreOpen: () => void;
  advanceOrder: (no: string) => void;
  cancelOrder: (no: string) => void;
  fireTicket: (no: string) => void;
  toggleKDone: (no: string, index: number) => void;
  toggleAvail: (id: string) => void;
  saveItem: (d: ItemDraft) => boolean;
  deleteItem: (id: string) => void;
  toggleCat: (name: string) => void;
  moveCat: (i: number, d: number) => void;
  addCat: (name: string) => boolean;
  toggleBrand: (id: string) => void;
  saveBrand: (b: Brand) => void;
  toggleSection: (k: HomeSectionKey) => void;
  moveSection: (i: number, d: number) => void;
  toggleBanner: (id: string) => void;
  moveBanner: (i: number, d: number) => void;
  setDeal: (d: Partial<Deal>) => void;
  savePost: (p: Post) => boolean;
  deletePost: (id: string) => void;
  togglePost: (id: string) => void;
  addPromo: (code: string, pct: number) => boolean;
  togglePromo: (code: string) => void;
  replyReview: (index: number) => void;

  /* simulation */
  tick: (n: number, ctx: { inAdmin: boolean; onTrack: boolean }) => void;
  resetDemo: () => void;
}

export type AppStore = State & Actions;

/* ------------------------------------------------------------------ helpers */

const move = <T>(arr: T[], i: number, d: number): T[] | null => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return null;
  const a = [...arr];
  [a[i], a[j]] = [a[j], a[i]];
  return a;
};

const lineKey = (c: CartLine) => `${c.id}-${c.s}-${[...c.ex].sort().join('.')}${c.deal ? '-d' : ''}`;

export const stepLabel = (o: Pick<Order, 'mode'> | undefined, i: number): string =>
  o && o.mode === 'pickup' && i === 2 ? 'Ready for pickup' : (CUSTOMER_STEPS[i]?.[0] ?? '');

let toastTimer: ReturnType<typeof setTimeout> | undefined;
let uid = 0;

const initialState = (): State => ({
  user: null,
  onboarded: false,
  pendingCheckout: false,
  theme: 'light',

  menu: MENU.map((m) => ({ ...m })),
  cats: CATS.map((name) => ({ name, on: true })),
  brands: BRANDS.map((b) => ({ ...b })),
  banners: HERO.map((b) => ({ ...b })),
  secs: SECTIONS.map((s) => ({ ...s })),
  deal: { id: 'smash', pct: 25, on: true },
  posts: POSTS.map((p) => ({ ...p })),
  promos: SEED_PROMOS.map((p) => ({ ...p })),

  storeOpen: true,
  prep: 18,
  fee: 2.99,
  freeAt: 40,
  sound: true,

  saved: ['brisket', 'carb', 'cheesecake'],
  cart: [],
  mode: 'delivery',
  promo: null,
  promoDraft: '',
  addrs: SEED_ADDRESSES.map((a) => ({ ...a })),
  addr: 0,
  speed: 0,
  payM: 0,
  note: '',
  cards: SEED_CARDS.map((c) => ({ ...c })),
  defCard: 'k1',
  credit: 12.5,
  points: 1240,
  redeemed: [],
  orders: SEED_ORDERS.map((o) => ({ ...o, items: o.items.map((i) => ({ ...i })) })),
  lastNo: null,
  inbox: SEED_INBOX.map((n) => ({ ...n })),
  reviews: SEED_REVIEWS.map((r) => ({ ...r })),
  bookings: SEED_BOOKINGS.map((b) => ({ ...b })),
  liked: [],
  prefs: { lang: 'English', orderNotif: true, offers: true, journalNotif: false, sms: false, location: true, personal: true },
  orderNotif: true,
  filters: { sort: 0, veg: false, hot: false, under: false },
  menuCat: 'All',
  menuBrand: null,

  kDone: {},

  toast: null,
  fly: null,
  bump: 0,
});

/* ------------------------------------------------------------------ store */

export const useApp = create<AppStore>()((set, get) => {
  const toast: Actions['showToast'] = (title, sub, icon = 'check', action) => {
    uid += 1;
    set({ toast: { id: uid, title, sub, icon, action } });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: null }), 2600);
  };

  const setOrder = (no: string, fn: (o: Order) => Order) => set((s) => ({ orders: s.orders.map((o) => (o.no === no ? fn(o) : o)) }));

  return {
    ...initialState(),

    dishOf: (id) => get().menu.find((m) => m.id === id) ?? MENU.find((m) => m.id === id) ?? get().menu[0],

    totals: () => {
      const s = get();
      return computeTotals({ cart: s.cart, dishOf: s.dishOf, mode: s.mode, speed: s.speed, fee: s.fee, freeAt: s.freeAt, promo: s.promo });
    },

    showToast: toast,
    hideToast: () => set({ toast: null }),
    flyToCart: (from, to) => set((s) => ({ fly: { key: (s.fly?.key ?? 0) + 1, from, to } })),
    endFly: () => set((s) => ({ fly: null, bump: s.bump + 1 })),

    /* session */
    setTheme: (theme) => set({ theme }),
    finishOnboarding: () => set({ onboarded: true }),
    signIn: (u) => set({ user: { name: u?.name?.trim() || DEMO_USER.name, email: u?.email?.trim() || DEMO_USER.email, phone: u?.phone ?? DEMO_USER.phone } }),
    signOut: () => set({ user: null, pendingCheckout: false }),
    setPendingCheckout: (pendingCheckout) => set({ pendingCheckout }),
    updateProfile: (user) => set({ user }),

    setMenuCat: (menuCat, brand) => set((s) => ({ menuCat, menuBrand: brand === undefined ? s.menuBrand : brand })),
    setMenuBrand: (menuBrand) => set({ menuBrand }),
    setFilters: (filters) => set({ filters }),

    /* cart */
    toggleSave: (id) => {
      const on = get().saved.includes(id);
      set((s) => ({ saved: on ? s.saved.filter((x) => x !== id) : [...s.saved, id] }));
      if (!on) toast('Saved', get().dishOf(id).name, 'favorite');
      return !on;
    },

    addToCart: (line, opts) => {
      const s = get();
      const dish = s.dishOf(line.id);
      if (!s.storeOpen) {
        toast('Kitchen is closed', 'Ordering reopens at 11:00 AM', 'schedule');
        return false;
      }
      if (!dish.avail) {
        toast('Sold out tonight', `${dish.name} is unavailable`, 'block');
        return false;
      }
      const key = lineKey(line);
      set((st) => {
        const cart = [...st.cart];
        const i = cart.findIndex((c) => lineKey(c) === key);
        if (i >= 0) cart[i] = { ...cart[i], q: cart[i].q + line.q };
        else cart.push({ ...line, ex: [...line.ex], ...(line.deal ? { dealPct: line.dealPct ?? st.deal.pct } : {}) });
        return { cart };
      });
      if (!opts?.silent) toast('Added to cart', `${line.q > 1 ? line.q + ' × ' : ''}${dish.name}`, 'shopping_bag', { label: 'View', href: '/cart' });
      return true;
    },

    setQty: (index, delta) => set((s) => ({ cart: s.cart.map((c, k) => (k === index ? { ...c, q: c.q + delta } : c)).filter((c) => c.q > 0) })),

    reorder: (no) => {
      const o = get().orders.find((x) => x.no === no);
      if (!o) return;
      set((s) => ({ cart: [...s.cart, ...o.items.map((it) => ({ ...it, ex: [...it.ex] }))] }));
      toast(
        'Added to cart',
        `${cnt(
          o.items.reduce((a, b) => a + b.q, 0),
          'item',
        )} from ${o.no}`,
        'replay',
        { label: 'View', href: '/cart' },
      );
    },

    setMode: (mode) => set({ mode }),

    applyPromo: (code) => {
      const c = get().promos.find((x) => x.on && x.code === code.trim().toUpperCase());
      if (!c) return 'That code isn’t active. Try FIG10.';
      set({ promo: { code: c.code, pct: c.pct } });
      toast('Promo applied', `${c.code} · ${c.pct}% off`, 'sell');
      return null;
    },
    removePromo: () => set({ promo: null, promoDraft: '' }),
    setPromoDraft: (promoDraft) => set({ promoDraft }),
    setCheckout: (p) => set(p),

    canCheckout: () => {
      const s = get();
      if (!s.storeOpen) {
        toast('Kitchen is closed', 'Ordering reopens at 11:00 AM', 'schedule');
        return 'closed';
      }
      if (!s.user) {
        set({ pendingCheckout: true });
        return 'auth';
      }
      return 'ok';
    },

    placeOrder: () => {
      const s = get();
      if (!s.cart.length) return null;
      const t = s.totals();
      const no = 'EK-' + (4830 + s.orders.length * 3);
      const card = s.cards.find((c) => c.id === s.defCard);
      const pay =
        s.payM === 1 && card
          ? `${card.brand === 'VISA' ? 'Visa' : card.brand === 'MASTERCARD' ? 'Mastercard' : card.brand} ${card.num}`
          : PAY_OPTIONS[s.payM].t;
      const order: Order = {
        no,
        cid: 'c1',
        time: 'Just now',
        step: 0,
        items: s.cart.map((c) => ({ ...c, ex: [...c.ex] })),
        pay,
        total: t.total,
        live: true,
        mins: 0,
        mode: s.mode,
      };
      set((st) => ({ orders: [order, ...st.orders], lastNo: no, cart: [], promo: null, promoDraft: '', note: '' }));
      return no;
    },

    /* account */
    addAddress: (n) => {
      const miss: string[] = [];
      if (!n.l1.trim()) miss.push('a street');
      if (!/^\d{5}$/.test(n.zip.trim())) miss.push('a 5‑digit ZIP');
      if (miss.length) {
        toast('Almost there', 'Add ' + miss.join(' and '), 'error');
        return miss.join(' and ');
      }
      const tag = n.tag === 'Other' ? n.custom.trim() || 'Other' : n.tag;
      const a: Address = {
        tag,
        icon: addressIconFor(n.tag),
        l1: n.l1.trim() + (n.apt.trim() ? ', ' + n.apt.trim() : ''),
        l2: (n.city.trim() + ' ' + n.zip.trim()).trim(),
        note: n.note.trim(),
        door: n.door,
        phone: n.phone,
      };
      set((s) => ({ addrs: [...s.addrs, a], addr: n.def ? s.addrs.length : s.addr }));
      toast('Address saved', a.l1, 'location_on');
      return null;
    },
    removeAddress: (i) => {
      const a = get().addrs[i];
      if (!a || get().addrs.length <= 1) return;
      set((s) => ({ addrs: s.addrs.filter((_, k) => k !== i), addr: 0 }));
      toast('Address removed', a.l1, 'delete');
    },

    addCard: (c) => {
      const d = c.num.replace(/\D/g, '');
      const okNum = d.length >= 15;
      const okExp = /^(0[1-9]|1[0-2])\/\d{2}$/.test(c.exp);
      const okCvv = /^\d{3,4}$/.test(c.cvv);
      if (!okNum || !okExp || !okCvv || !c.name.trim()) {
        const msg = !okNum
          ? 'Card number looks too short'
          : !okExp
            ? 'Use MM/YY for the expiry date'
            : !okCvv
              ? 'CVV is 3 or 4 digits'
              : 'Add the name on the card';
        toast('Check card details', msg, 'error');
        return msg;
      }
      const b = cardBrandOf(d);
      const id = 'k' + Date.now();
      set((s) => ({
        cards: [...s.cards, { id, brand: b.name, num: '•••• ' + d.slice(-4), exp: c.exp, bg: b.bg, name: c.name.trim().toUpperCase(), nick: c.nick.trim() }],
        defCard: c.def ? id : s.defCard,
        payM: c.def ? 1 : s.payM,
      }));
      toast('Card added', `${b.name} •••• ${d.slice(-4)}`, 'credit_card');
      return null;
    },
    removeCard: (id) => {
      const s = get();
      const c = s.cards.find((x) => x.id === id);
      if (!c) return false;
      if (s.cards.length <= 1) {
        toast('Keep at least one card', 'Add another card before removing this one', 'info');
        return false;
      }
      const rest = s.cards.filter((x) => x.id !== id);
      set({ cards: rest, defCard: s.defCard === id ? rest[0].id : s.defCard });
      toast('Card removed', `${c.brand} ${c.num}`, 'delete');
      return true;
    },
    makeDefaultCard: (id) => {
      const c = get().cards.find((x) => x.id === id);
      set({ defCard: id, payM: 1 });
      if (c) toast('Default updated', `${c.brand} ${c.num}`, 'check_circle');
    },
    addGiftCard: () => {
      set((s) => ({ credit: s.credit + 25 }));
      toast('Gift card redeemed', '$25.00 added to Fig credit', 'redeem');
    },
    redeem: (r) => {
      const s = get();
      if (s.redeemed.includes(r.id)) return;
      if (s.points < r.pts) {
        toast('Not enough points', `You need ${r.pts - s.points} more`, 'info');
        return;
      }
      set((st) => ({
        points: st.points - r.pts,
        redeemed: [...st.redeemed, r.id],
        ...(r.credit ? { credit: st.credit + r.credit } : { cart: [...st.cart, { id: r.dish!, s: r.s ?? 0, ex: [], q: 1, deal: true, dealPct: 100 }] }),
      }));
      if (r.credit) toast('Reward redeemed', `${money(r.credit)} added to Fig credit`, 'redeem');
      else toast('Reward redeemed', `${r.l} added to your cart free`, 'redeem', { label: 'View', href: '/cart' });
    },

    /* inbox */
    pushInbox: (icon, title, sub) => {
      uid += 1;
      set((s) => ({ inbox: [{ id: `n${Date.now()}-${uid}`, icon, title, sub, time: 'Now', unread: true }, ...s.inbox] }));
    },
    readNotif: (id) => set((s) => ({ inbox: s.inbox.map((x) => (x.id === id ? { ...x, unread: false } : x)) })),
    readAllNotifs: () => set((s) => ({ inbox: s.inbox.map((x) => ({ ...x, unread: false })) })),
    deleteNotif: (id) => {
      const n = get().inbox.find((x) => x.id === id);
      set((s) => ({ inbox: s.inbox.filter((x) => x.id !== id) }));
      if (n) toast('Notification deleted', n.title, 'delete');
    },

    submitRating: (no, stars, tags, text) => {
      const s = get();
      const o = s.orders.find((x) => x.no === no) ?? s.orders.find((x) => x.cid === 'c1' && x.step === 3);
      const dish = o ? s.dishOf(o.items[0].id).name : 'Fig order';
      set((st) => ({
        reviews: [
          { name: st.user?.name ?? DEMO_USER.name, stars, text: text.trim() || tags.join(' · ') || 'Great meal.', dish, time: 'Just now', replied: false },
          ...st.reviews,
        ],
        orders: st.orders.map((x) => (o && x.no === o.no ? { ...x, rated: stars } : x)),
        points: st.points + 50,
      }));
    },

    submitIssue: (no, type) => {
      const t = ISSUES[type]?.[0] ?? 'Issue';
      set((s) => ({ credit: s.credit + 5 }));
      get().pushInbox('support_agent', `We’re on it · ${no ?? 'your order'}`, `${t} reported. We added $5.00 Fig credit while the team looks into it.`);
      toast('Issue reported', '$5.00 credit added to your account', 'support_agent');
    },

    addBooking: (b) => {
      const s = get();
      if (!s.user) return null;
      const booking: Booking = { ...b, id: 'b' + Date.now(), code: 'R‑' + (2800 + Math.floor(Math.random() * 190)), name: s.user.name, status: 0, mine: true };
      set((st) => ({
        bookings: [...st.bookings, booking].sort((x, y) => x.day - y.day || x.time.localeCompare(y.time, undefined, { numeric: true })),
        points: st.points + 100,
      }));
      return booking;
    },
    setBookingStatus: (id, status) => set((s) => ({ bookings: s.bookings.map((x) => (x.id === id ? { ...x, status } : x)) })),
    toggleLike: (postId) => set((s) => ({ liked: s.liked.includes(postId) ? s.liked.filter((x) => x !== postId) : [...s.liked, postId] })),
    setPrefs: (p) => set((s) => ({ prefs: { ...s.prefs, ...p } })),
    setOrderNotif: (orderNotif) => set({ orderNotif }),

    /* admin */
    setStore: (p) => set(p),
    toggleStoreOpen: () => {
      const open = get().storeOpen;
      set({ storeOpen: !open });
      toast(open ? 'Kitchen closed' : 'Kitchen open', open ? 'Customers can’t place new orders' : 'Taking orders again', open ? 'block' : 'storefront');
    },
    advanceOrder: (no) => {
      const o = get().orders.find((x) => x.no === no);
      if (!o || o.step >= 3) return;
      const next = (o.step + 1) as OrderStep;
      setOrder(no, (x) => ({ ...x, step: next, live: false }));
      toast('Status updated', `${no} → ${['New', 'Preparing', 'On the way', 'Delivered', 'Cancelled'][next]}`, 'sync');
      if (o.cid === 'c1') get().pushInbox(CUSTOMER_STEPS[next][2], stepLabel(o, next), `${no} · ${CUSTOMER_STEPS[next][1]}`);
    },
    cancelOrder: (no) => {
      setOrder(no, (x) => ({ ...x, step: 4, live: false }));
      toast('Order cancelled', `${no} · refund issued`, 'cancel');
    },
    fireTicket: (no) => {
      const s = get();
      const o = s.orders.find((x) => x.no === no);
      if (!o || o.step > 1) return;
      const next = (o.step + 1) as OrderStep;
      setOrder(no, (x) => ({ ...x, step: next, live: false }));
      const custName = (CUSTOMERS.find((c) => c.id === o.cid) ?? CUSTOMERS[0]).name;
      toast(o.step === 0 ? 'Ticket fired' : 'Order ready', `${no} · ${custName}`, o.step === 0 ? 'eco' : 'room_service');
      if (o.cid === 'c1') get().pushInbox(CUSTOMER_STEPS[next][2], stepLabel(o, next), `${no} · ${CUSTOMER_STEPS[next][1]}`);
    },
    toggleKDone: (no, k) =>
      set((s) => {
        const cur = s.kDone[no] ?? [];
        return { kDone: { ...s.kDone, [no]: cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k] } };
      }),
    toggleAvail: (id) => set((s) => ({ menu: s.menu.map((p) => (p.id === id ? { ...p, avail: !p.avail } : p)) })),
    saveItem: (e) => {
      if (!e.name.trim()) {
        toast('Name required', 'Give the dish a name first', 'error');
        return false;
      }
      const tag = e.tag === 'None' ? '' : e.tag;
      if (e.id) {
        set((s) => ({
          menu: s.menu.map((p) => (p.id === e.id ? { ...p, name: e.name.trim(), price: e.price, cat: e.cat, brand: e.brand, tag, avail: e.avail } : p)),
        }));
      } else {
        set((s) => ({
          menu: [
            ...s.menu,
            {
              id: 'n' + Date.now(),
              name: e.name.trim(),
              cat: e.cat,
              price: e.price,
              rating: 5,
              reviews: 0,
              time: s.prep,
              kcal: 600,
              img: e.img,
              tag,
              brand: e.brand || 'fire',
              desc: 'Freshly added to the Fig menu.',
              avail: e.avail,
            },
          ],
        }));
      }
      toast(e.id ? 'Item saved' : 'Item added', e.name.trim(), 'check');
      return true;
    },
    deleteItem: (id) => {
      const d = get().menu.find((m) => m.id === id);
      set((s) => ({ menu: s.menu.filter((p) => p.id !== id), cart: s.cart.filter((c) => c.id !== id), saved: s.saved.filter((x) => x !== id) }));
      if (d) toast('Item deleted', d.name, 'delete');
    },
    toggleCat: (name) => set((s) => ({ cats: s.cats.map((x) => (x.name === name ? { ...x, on: !x.on } : x)) })),
    moveCat: (i, d) => {
      const a = move(get().cats, i, d);
      if (a) set({ cats: a });
    },
    addCat: (name) => {
      const n = name.trim();
      if (!n) return false;
      if (get().cats.some((c) => c.name.toLowerCase() === n.toLowerCase())) {
        toast('Already exists', n, 'error');
        return false;
      }
      set((s) => ({ cats: [...s.cats, { name: n, on: true }] }));
      toast('Category added', `${n} · assign dishes from Menu items`, 'category');
      return true;
    },
    toggleBrand: (id) => set((s) => ({ brands: s.brands.map((x) => (x.id === id ? { ...x, on: !x.on } : x)) })),
    saveBrand: (b) => {
      set((s) => ({ brands: s.brands.map((x) => (x.id === b.id ? { ...b } : x)) }));
      toast('Kitchen saved', b.name, 'storefront');
    },
    toggleSection: (k) => set((s) => ({ secs: s.secs.map((y) => (y.k === k ? { ...y, on: !y.on } : y)) })),
    moveSection: (i, d) => {
      const a = move(get().secs, i, d);
      if (a) set({ secs: a });
    },
    toggleBanner: (id) => set((s) => ({ banners: s.banners.map((y) => (y.id === id ? { ...y, on: !y.on } : y)) })),
    moveBanner: (i, d) => {
      const a = move(get().banners, i, d);
      if (a) set({ banners: a });
    },
    setDeal: (d) => set((s) => ({ deal: { ...s.deal, ...d } })),
    savePost: (e) => {
      if (!e.title.trim()) {
        toast('Title required', 'Give the story a headline', 'error');
        return false;
      }
      const words = e.body.trim() ? e.body.trim().split(/\s+/).length : 0;
      const mins = Math.max(1, Math.round(words / 200));
      const exists = get().posts.some((p) => p.id === e.id);
      const id = exists ? e.id : 'p' + Date.now();
      set((s) => {
        let posts = exists ? s.posts.map((p) => (p.id === e.id ? { ...e, mins } : p)) : [{ ...e, id, date: shortToday(), mins }, ...s.posts];
        if (e.featured) posts = posts.map((p) => ({ ...p, featured: p.id === id }));
        return { posts };
      });
      toast(e.on ? 'Story published' : 'Draft saved', e.title, e.on ? 'public' : 'edit_note');
      return true;
    },
    deletePost: (id) => {
      const p = get().posts.find((x) => x.id === id);
      set((s) => ({ posts: s.posts.filter((x) => x.id !== id) }));
      if (p) toast('Story deleted', p.title, 'delete');
    },
    togglePost: (id) => {
      const p = get().posts.find((x) => x.id === id);
      if (!p) return;
      set((s) => ({ posts: s.posts.map((x) => (x.id === id ? { ...x, on: !x.on } : x)) }));
      toast(p.on ? 'Moved to drafts' : 'Story published', p.title, p.on ? 'edit_note' : 'public');
    },
    addPromo: (code, pct) => {
      const c = code.trim().toUpperCase();
      if (!c) {
        toast('Code required', 'Type a code first', 'error');
        return false;
      }
      if (get().promos.some((p) => p.code === c)) {
        toast('Already exists', c, 'error');
        return false;
      }
      set((s) => ({ promos: [{ code: c, pct, used: 0, on: true }, ...s.promos] }));
      toast('Promo created', `${c} · ${pct}% off`, 'sell');
      return true;
    },
    togglePromo: (code) => set((s) => ({ promos: s.promos.map((y) => (y.code === code ? { ...y, on: !y.on } : y)) })),
    replyReview: (index) => {
      const r = get().reviews[index];
      set((s) => ({ reviews: s.reviews.map((x, k) => (k === index ? { ...x, replied: true } : x)) }));
      if (r) toast('Reply sent', 'To ' + r.name.split(' ')[0], 'reply');
    },

    /* simulation — called once per second by useSimulation() */
    tick: (n, ctx) => {
      if (n % 10 === 0) set((s) => ({ orders: s.orders.map((o) => (o.step < 3 ? { ...o, mins: (o.mins || 0) + 1 } : o)) }));
      if (n % 8 === 0) {
        const s = get();
        const live = s.orders.find((o) => o.live && o.step < 3);
        if (!live) return;
        const step = (live.step + 1) as OrderStep;
        setOrder(live.no, (o) => ({ ...o, step, live: step < 3 }));
        const label = stepLabel(live, step);
        get().pushInbox(CUSTOMER_STEPS[step][2], `${live.no} · ${label}`, CUSTOMER_STEPS[step][1]);
        if (!ctx.inAdmin && s.orderNotif) {
          toast(
            label,
            `${live.no} · ${CUSTOMER_STEPS[step][1]}`,
            CUSTOMER_STEPS[step][2],
            ctx.onTrack ? undefined : { label: 'Track', href: `/track/${live.no}` },
          );
        }
      }
    },

    resetDemo: () => set(initialState()),
  };
});

/* ------------------------------------------------------------------ selectors */

export const selectLiveMenu = (s: AppStore): Dish[] => {
  const cats = new Set(s.cats.filter((c) => c.on).map((c) => c.name));
  const offBrands = new Set(s.brands.filter((b) => !b.on).map((b) => b.id));
  return s.menu.filter((p) => cats.has(p.cat) && !offBrands.has(p.brand));
};

export const selectMyOrders = (s: AppStore): Order[] => s.orders.filter((o) => o.cid === 'c1');
export const selectCartCount = (s: AppStore): number => s.cart.reduce((a, c) => a + c.q, 0);
export const selectUnread = (s: AppStore): number => s.inbox.filter((n) => n.unread).length;
export const selectBanners = (s: AppStore): Banner[] => s.banners.filter((b) => b.on);
export const selectDefaultCard = (s: AppStore): Card | undefined => s.cards.find((c) => c.id === s.defCard);

export const payLabel = (s: AppStore, short = false): string => {
  if (s.payM === 0) return 'Apple Pay';
  if (s.payM === 2) return short ? 'Cash' : 'Cash on delivery';
  const c = selectDefaultCard(s);
  return `${c?.brand ?? 'Card'} ${c?.num ?? ''}`.trim();
};
