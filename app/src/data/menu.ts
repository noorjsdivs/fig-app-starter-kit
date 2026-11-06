import { unsplash } from './images';
import type { Brand, Dish, DishTag, Extra, SizeOption } from './types';

type Row = [
  id: string,
  name: string,
  cat: string,
  price: number,
  rating: number,
  reviews: number,
  time: number,
  kcal: number,
  photo: string,
  tag: DishTag,
  desc: string,
];

const ROWS: Row[] = [
  [
    'marg',
    'Margherita Classica',
    'Pizza',
    12.5,
    4.8,
    412,
    18,
    780,
    '1574071318508-1cdbab80d002',
    'Bestseller',
    'San Marzano tomato, fior di latte, torn basil and olive oil on our 48‑hour fermented, wood‑fired crust.',
  ],
  [
    'pep',
    'Hot Honey Pepperoni',
    'Pizza',
    14.5,
    4.9,
    538,
    20,
    920,
    '1628840042765-356cda07504e',
    'Spicy',
    'Cup‑and‑char pepperoni, mozzarella and a finishing drizzle of chili‑infused wildflower honey.',
  ],
  [
    'funghi',
    'Truffle Funghi',
    'Pizza',
    15.5,
    4.7,
    286,
    22,
    860,
    '1565299624946-b28f40a0ae38',
    'New',
    'Roasted wild mushrooms, taleggio, thyme and black truffle oil on a white garlic base.',
  ],
  [
    'brisket',
    'Smoked Brisket Burger',
    'Burgers',
    14,
    4.9,
    367,
    16,
    1040,
    '1553979459-d2229ba7433b',
    'Bestseller',
    'Twelve‑hour smoked brisket, aged cheddar, pickled onion and smoky mayo in a toasted brioche bun.',
  ],
  [
    'smash',
    'Double Smash',
    'Burgers',
    13.5,
    4.8,
    451,
    14,
    980,
    '1586190848861-99aa4a171e90',
    '',
    'Two crispy‑edged beef patties, American cheese, house pickles and Fig sauce.',
  ],
  [
    'chick',
    'Fig Classic Burger',
    'Burgers',
    12,
    4.6,
    198,
    15,
    890,
    '1571091718767-18b5b1457add',
    '',
    'Dry‑aged beef, cheddar, butter lettuce, tomato and house sauce on a sesame bun.',
  ],
  [
    'carb',
    'Spaghetti Carbonara',
    'Pasta',
    13,
    4.7,
    240,
    14,
    720,
    '1612874742237-6526221588e3',
    '',
    'Bronze‑cut spaghetti, crisp guanciale, egg yolk, pecorino and plenty of black pepper.',
  ],
  [
    'lasagne',
    'Wood‑Oven Lasagne',
    'Pasta',
    14,
    4.8,
    322,
    18,
    910,
    '1574894709920-11b28e7367e3',
    '',
    'Slow‑cooked beef ragù, béchamel and parmigiano, baked until the edges crackle.',
  ],
  [
    'risotto',
    'Prawn & Salmon Risotto',
    'Pasta',
    16.5,
    4.6,
    141,
    20,
    690,
    '1476124369491-e7addf5db371',
    'New',
    'Creamy carnaroli with seared salmon, tiger prawns, lemon and dill.',
  ],
  [
    'handi',
    'Chicken Handi Bowl',
    'Bowls',
    13.5,
    4.8,
    276,
    17,
    840,
    '1603894584373-5ac82b2ae398',
    '',
    'Charred chicken in a rich, creamy tomato‑spice sauce over saffron rice.',
  ],
  [
    'biryani',
    'Lamb Biryani',
    'Bowls',
    14.5,
    4.7,
    189,
    22,
    790,
    '1563379091339-03b21ab4a4f8',
    '',
    'Fragrant basmati layered with slow‑spiced lamb, fried onion and fresh mint.',
  ],
  [
    'ramen',
    'Fig Ramen',
    'Bowls',
    13,
    4.8,
    233,
    15,
    650,
    '1569718212165-3a8278d5f624',
    'New',
    'Rich chicken broth, springy noodles, jammy egg and charred spring onion.',
  ],
  [
    'wings',
    'Crispy Chicken Wings',
    'Sides',
    9.5,
    4.7,
    402,
    12,
    620,
    '1567620832903-9fc6debc209f',
    '',
    'Double‑fried wings tossed in hot honey or garlic‑parmesan.',
  ],
  [
    'fries',
    'Truffle Parmesan Fries',
    'Sides',
    6.5,
    4.7,
    288,
    10,
    480,
    '1573080496219-bb080dd4f877',
    '',
    'Hand‑cut fries tossed in truffle oil, parmesan and parsley. Served with aioli.',
  ],
  [
    'cheesecake',
    'Blueberry Cheesecake',
    'Desserts',
    7.5,
    4.9,
    301,
    5,
    520,
    '1567171466295-4afa63d45416',
    '',
    'Dense, creamy New York cheesecake with a wild blueberry topping. Baked every morning.',
  ],
  [
    'gateau',
    'Chocolate Gateau',
    'Desserts',
    8,
    4.8,
    233,
    5,
    610,
    '1578985545062-69928b1d9587',
    '',
    'Layers of dark‑chocolate sponge and ganache with vanilla cream.',
  ],
];

export const BRAND_OF: Record<string, string> = {
  marg: 'fire',
  pep: 'fire',
  funghi: 'fire',
  brisket: 'smash',
  smash: 'smash',
  chick: 'smash',
  wings: 'smash',
  fries: 'smash',
  carb: 'nonna',
  lasagne: 'nonna',
  risotto: 'nonna',
  handi: 'spice',
  biryani: 'spice',
  ramen: 'spice',
  cheesecake: 'sugar',
  gateau: 'sugar',
};

export const MENU: Dish[] = ROWS.map((a) => ({
  id: a[0],
  name: a[1],
  cat: a[2],
  price: a[3],
  rating: a[4],
  reviews: a[5],
  time: a[6],
  kcal: a[7],
  img: unsplash(a[8]),
  tag: a[9],
  desc: a[10],
  avail: true,
  brand: BRAND_OF[a[0]],
}));

export const CATS = ['Pizza', 'Burgers', 'Pasta', 'Bowls', 'Sides', 'Desserts'];

/** First dish image per category, used for category tiles. */
export const CAT_IMG: Record<string, string> = MENU.reduce<Record<string, string>>((acc, m) => {
  if (!acc[m.cat]) acc[m.cat] = m.img;
  return acc;
}, {});

export const BRANDS: Brand[] = [
  { id: 'fire', name: 'Fig Pizza Co.', tag: 'Wood‑fired Neapolitan', icon: 'local_pizza', img: unsplash('1579751626657-72bc17010498', 700), on: true },
  { id: 'smash', name: 'Smash Lab', tag: 'Burgers, wings & fries', icon: 'lunch_dining', img: unsplash('1568901346375-23c9450c58cd', 700), on: true },
  { id: 'nonna', name: 'Nonna’s Table', tag: 'Fresh pasta, slow sauces', icon: 'dinner_dining', img: unsplash('1621996346565-e3dbc646d9a9', 700), on: true },
  { id: 'spice', name: 'Spice Route', tag: 'Curries, biryani & ramen', icon: 'ramen_dining', img: unsplash('1565557623262-b51c2513a641', 700), on: true },
  { id: 'sugar', name: 'Sugar & Smoke', tag: 'Cakes baked every morning', icon: 'cake', img: unsplash('1606313564200-e75d5e30476c', 700), on: true },
];

const SIZES: Record<string, SizeOption[]> = {
  Pizza: [
    { label: '10"', delta: -2 },
    { label: '12"', delta: 0 },
    { label: '14"', delta: 3 },
  ],
  Desserts: [
    { label: 'Slice', delta: 0 },
    { label: 'Double', delta: 6.5 },
  ],
  _: [
    { label: 'Regular', delta: 0 },
    { label: 'Large', delta: 3 },
  ],
};

export const sizesOf = (cat: string): SizeOption[] => SIZES[cat] ?? SIZES._;

/** Pizza defaults to 12" (index 1); everything else to the first size. */
export const defaultSize = (cat: string): number => (cat === 'Pizza' ? 1 : 0);

const EXTRAS = {
  sweet: [
    { id: 'cream', label: 'Vanilla cream', price: 1.5 },
    { id: 'berry', label: 'Berry compote', price: 1.5 },
  ],
  savory: [
    { id: 'cheese', label: 'Extra cheese', price: 1.5 },
    { id: 'chili', label: 'Calabrian chili oil', price: 0.8 },
    { id: 'dip', label: 'Garlic dip', price: 1 },
    { id: 'side', label: 'Side of fries', price: 3.5 },
  ],
} satisfies Record<string, Extra[]>;

export const extrasOf = (cat: string): Extra[] => (cat === 'Desserts' ? EXTRAS.sweet : EXTRAS.savory);
export const ALL_EXTRAS: Extra[] = [...EXTRAS.sweet, ...EXTRAS.savory];

export const TAGS = ['None', 'Bestseller', 'New', 'Spicy'] as const;
export const VEG = ['marg', 'funghi', 'fries', 'cheesecake', 'gateau'];
export const HOT = ['pep', 'wings', 'biryani', 'chick'];
export const SORTS = ['Most popular', 'Price: low to high', 'Fastest'];
export const POPULAR_IDS = ['pep', 'brisket', 'carb', 'ramen'];
