import { COVERS, unsplash } from './images';
import type { Banner, Faq, HomeSection, IconName, OnboardingSlide, Post, PostCategory, Reward, SeatArea } from './types';

export const HERO: Banner[] = [
  {
    id: 'h0',
    eb: 'Fresh from the oven',
    title: 'Fired at 480°C, ready in 18',
    cta: 'Order pizza',
    cat: 'Pizza',
    img: unsplash('1579751626657-72bc17010498', 1100),
    on: true,
  },
  {
    id: 'h1',
    eb: 'New on the menu',
    title: 'Truffle Funghi is here',
    cta: 'Try it',
    dish: 'funghi',
    img: unsplash('1565299624946-b28f40a0ae38', 1100),
    on: true,
  },
  {
    id: 'h2',
    eb: 'Sweet finish',
    title: 'Desserts baked every morning',
    cta: 'See desserts',
    cat: 'Desserts',
    img: unsplash('1565958011703-44f9829ba187', 1100),
    on: true,
  },
  {
    id: 'h3',
    eb: 'Weeknight deal',
    title: '15% off Mon–Thu with WEEKNIGHT15',
    cta: 'Order now',
    cat: 'All',
    img: unsplash('1540189549336-e6e99c3679fe', 1100),
    on: false,
  },
];

export const SECTIONS: HomeSection[] = [
  { k: 'hero', l: 'Promo banners', icon: 'view_carousel', on: true },
  { k: 'cats', l: 'Categories', icon: 'category', on: true },
  { k: 'deal', l: 'Deal of the day', icon: 'bolt', on: true },
  { k: 'brands', l: 'Our kitchens', icon: 'storefront', on: true },
  { k: 'popular', l: 'Popular tonight', icon: 'eco', on: true },
  { k: 'again', l: 'Order again', icon: 'replay', on: true },
  { k: 'reserve', l: 'Book a table', icon: 'event_seat', on: true },
  { k: 'rated', l: 'Top rated', icon: 'star', on: true },
  { k: 'journal', l: 'From the journal', icon: 'auto_stories', on: true },
];

export const POST_CATS: PostCategory[] = ['Behind the pass', 'Recipes', 'Guides', 'News'];

export const POSTS: Post[] = [
  {
    id: 'p1',
    title: 'The 48‑hour dough behind every Fig pizza',
    cat: 'Behind the pass',
    img: COVERS[0],
    author: 'Chef Lena Ortiz',
    date: 'Oct 10',
    mins: 4,
    featured: true,
    on: true,
    dish: 'marg',
    likes: 214,
    excerpt: 'Why we let our dough rest for two days, and what it does to the crust.',
    body: 'Every pizza that leaves our oven started two days earlier. We mix a wet dough with just flour, water, salt and a pinch of yeast, then let it rest cold for 48 hours.\n\nThat long, slow ferment is where the flavour comes from. The yeast has time to break down starches into sugars, which caramelise in the 480°C oven and give the crust its leopard‑spotted char.\n\nIt also makes the dough easier to digest and lighter to eat. Most guests tell us they can finish a whole 12‑inch pie and still order dessert. We think that’s the best review there is.',
  },
  {
    id: 'p2',
    title: 'How we smash a burger (and why the edges matter)',
    cat: 'Recipes',
    img: COVERS[1],
    author: 'Theo Park',
    date: 'Oct 7',
    mins: 3,
    featured: false,
    on: true,
    dish: 'smash',
    likes: 168,
    excerpt: 'A ripping‑hot plancha, a heavy press and ten seconds of patience.',
    body: 'A smash burger lives or dies by its crust. We start with an 80/20 blend, rolled into loose balls and kept cold until the last second.\n\nThe plancha runs at 260°C. Ball down, parchment on, press hard for ten seconds and don’t touch it again until the edges go lacy and brown.\n\nFlip, cheese, stack. The whole thing takes under two minutes, which is why it’s always one of the fastest dishes on the menu.',
  },
  {
    id: 'p3',
    title: 'Five pasta shapes and the sauces they were made for',
    cat: 'Guides',
    img: COVERS[2],
    author: 'Chef Lena Ortiz',
    date: 'Oct 2',
    mins: 5,
    featured: false,
    on: true,
    dish: 'carb',
    likes: 131,
    excerpt: 'Ridges, tubes and ribbons each grip sauce differently. Here’s our cheat sheet.',
    body: 'Long, thin shapes like spaghetti want silky, emulsified sauces. Think carbonara or cacio e pepe, where the sauce coats rather than pools.\n\nTubes like rigatoni catch chunky ragù inside and on their ridges. Ribbons like pappardelle are built for slow‑braised meat.\n\nNext time you order, try matching the shape to the sauce. You’ll taste the difference.',
  },
  {
    id: 'p4',
    title: 'Patio season: our chef’s counter is open',
    cat: 'News',
    img: COVERS[3],
    author: 'Fig & Fennel Team',
    date: 'Sep 28',
    mins: 2,
    featured: false,
    on: true,
    dish: null,
    likes: 97,
    excerpt: 'Eight seats facing the oven, a rotating tasting menu and first look at new dishes.',
    body: 'We’ve opened eight seats right at the pass. Guests at the chef’s counter see every pizza go into the oven and get first taste of dishes we’re still testing.\n\nBook it from the app under Book a table and choose Chef’s counter. Seats open daily from 5:30 PM.',
  },
  {
    id: 'p5',
    title: 'A slow Sunday: braising lamb for biryani',
    cat: 'Recipes',
    img: COVERS[4],
    author: 'Arjun Mehta',
    date: 'Sep 21',
    mins: 6,
    featured: false,
    on: false,
    dish: 'biryani',
    likes: 0,
    excerpt: 'Our Spice Route head cook walks through his family’s Sunday ritual.',
    body: 'Draft in progress.',
  },
];

export const ONBOARDING: OnboardingSlide[] = [
  {
    img: unsplash('1553979459-d2229ba7433b', 700),
    l0: 'Delicious food,',
    l1: 'delivered to you',
    sub: 'Your favourite dishes from our kitchen, fresh at your doorstep.',
    icon: 'restaurant_menu',
    t: 'Fresh, top‑rated dishes',
    d: 'Pizzas, burgers and bowls cooked to order.',
    bg: ['#FFE7D2', '#FFD2AE'],
    fg: '#C2540A',
  },
  {
    img: unsplash('1569718212165-3a8278d5f624', 700),
    l0: 'Hot and fast,',
    l1: 'tracked live',
    sub: 'Follow every order from our oven to your door, minute by minute.',
    icon: 'two_wheeler',
    t: 'Fast & reliable delivery',
    d: 'Real‑time tracking, on time.',
    bg: ['#FFF6CF', '#FFE9A3'],
    fg: '#8A6200',
  },
  {
    img: unsplash('1574071318508-1cdbab80d002', 700),
    l0: 'Pay your way,',
    l1: 'safe and simple',
    sub: 'Cards, wallets or Fig credit. Check out in a single tap.',
    icon: 'credit_card',
    t: 'Secure & easy payments',
    d: 'Multiple options, 100% secure.',
    bg: ['#FFE3EC', '#FFCCDD'],
    fg: '#B23A6B',
  },
];

export const SEATS: SeatArea[] = [
  {
    l: 'Dining room',
    note: 'Warm and lively, steps from the oven',
    cap: 'Up to 10 guests',
    icon: 'table_restaurant',
    img: unsplash('1517248135467-4c7edcad34c4', 500),
  },
  { l: 'Patio', note: 'Heated, covered, dog friendly', cap: 'Up to 6 guests', icon: 'deck', img: unsplash('1555396273-367ea4eb4db5', 500) },
  { l: 'Chef’s counter', note: 'Front‑row seats at the pass', cap: 'Up to 4 guests', icon: 'countertops', img: unsplash('1414235077428-338989a2e8c0', 500) },
];

export const SLOT_GROUPS: [string, string[]][] = [
  ['Early evening', ['5:00', '5:30', '6:00', '6:30']],
  ['Prime time', ['7:00', '7:30', '8:00', '8:30']],
  ['Late', ['9:00', '9:30', '10:00', '10:30']],
];

export const OCCASIONS: [string, IconName][] = [
  ['Birthday', 'cake'],
  ['Anniversary', 'favorite'],
  ['Date night', 'wine_bar'],
  ['Business', 'work'],
  ['Celebration', 'celebration'],
];

export const HELP_TOPICS: [string, IconName][] = [
  ['Orders', 'receipt_long'],
  ['Delivery', 'two_wheeler'],
  ['Payments', 'credit_card'],
  ['Account', 'person'],
  ['Dining in', 'event_seat'],
  ['Allergens', 'eco'],
];

export const FAQS: Faq[] = [
  {
    id: 'f0',
    topic: 'Delivery',
    q: 'How long does delivery take?',
    a: 'Most orders arrive in 25–35 minutes. Priority delivery gets there in 15–20 minutes for $1.99. You can watch every step on the live tracking screen.',
  },
  {
    id: 'f1',
    topic: 'Orders',
    q: 'Can I change my order after placing it?',
    a: 'Message us within 2 minutes of ordering from the tracking screen. Once the kitchen fires your dish we can’t swap it, but we can add items as a separate order.',
  },
  {
    id: 'f2',
    topic: 'Orders',
    q: 'Something is missing from my order',
    a: 'Tap “Get help with this order” above and choose Missing item. We’ll refund it to Fig credit instantly or send it out again, whichever you prefer.',
  },
  {
    id: 'f3',
    topic: 'Payments',
    q: 'When is my card charged?',
    a: 'We place a hold when you order and charge it once the kitchen accepts. If we cancel, the hold is released within 3–5 business days.',
  },
  {
    id: 'f4',
    topic: 'Payments',
    q: 'How do I use Fig credit?',
    a: 'Credit applies automatically at checkout before your card is charged. You can see your balance in Payment methods.',
  },
  {
    id: 'f5',
    topic: 'Account',
    q: 'How do I change my email or phone?',
    a: 'Go to Profile → Edit profile. Changes to your email need a quick verification code.',
  },
  {
    id: 'f6',
    topic: 'Account',
    q: 'How do Fig Club points work?',
    a: 'You earn 10 points for every $1 spent, plus bonus points for reviews and bookings. Redeem points for free dishes or money off.',
  },
  {
    id: 'f7',
    topic: 'Dining in',
    q: 'How long do you hold a reservation?',
    a: 'We hold tables for 15 minutes. Running late? Message us from your reservation and we’ll do our best to keep it.',
  },
  {
    id: 'f8',
    topic: 'Dining in',
    q: 'Can I bring a large group?',
    a: 'Groups up to 10 can book in the app. For 11 or more, chat with us and we’ll set up the dining room for you.',
  },
  {
    id: 'f9',
    topic: 'Allergens',
    q: 'Do you have gluten‑free options?',
    a: 'Our risotto, biryani and Chicken Handi bowl are made without gluten. Pizza dough contains wheat, and we can’t guarantee zero cross‑contact.',
  },
  {
    id: 'f10',
    topic: 'Allergens',
    q: 'Which dishes are vegetarian?',
    a: 'Margherita, Truffle Funghi, Truffle Parmesan Fries and all desserts are vegetarian. Use the Vegetarian filter in the menu to see them.',
  },
  {
    id: 'f11',
    topic: 'Delivery',
    q: 'Do you deliver outside SoHo?',
    a: 'We deliver within 3 miles of 112 Spring St, covering most of Lower Manhattan. Outside that, choose Pickup on the Home screen.',
  },
];

export const ISSUES: [string, IconName][] = [
  ['Missing item', 'remove_shopping_cart'],
  ['Wrong item', 'swap_horiz'],
  ['Arrived late', 'schedule'],
  ['Food quality', 'sentiment_dissatisfied'],
  ['Something else', 'help'],
];

export const RATING_TAGS = ['Hot & fresh', 'Fast delivery', 'Great packaging', 'Generous portions', 'Friendly courier'];
export const TIPS = [0, 2, 3, 5];
export const RATING_MOODS = ['Tap to rate', 'Not great', 'Could be better', 'Pretty good', 'Really good', 'Absolutely loved it'];

export const REWARDS: Reward[] = [
  { id: 'r1', l: 'Truffle Parmesan Fries', pts: 500, dish: 'fries', s: 0 },
  { id: 'r2', l: '$5 off your next order', pts: 800, credit: 5 },
  { id: 'r3', l: 'Blueberry Cheesecake', pts: 1000, dish: 'cheesecake', s: 0 },
  { id: 'r4', l: 'Any 12" pizza', pts: 2000, dish: 'marg', s: 1 },
];

export const EARN: [IconName, string, string][] = [
  ['shopping_bag', 'Order food', '10 pts per $1'],
  ['rate_review', 'Rate an order', '+50 pts'],
  ['event_seat', 'Book a table', '+100 pts'],
  ['group_add', 'Refer a friend', '+500 pts'],
];

export const TIERS: [string, number][] = [
  ['Bronze', 0],
  ['Silver', 1000],
  ['Gold', 2500],
  ['Platinum', 5000],
];

/** Live order steps shown to the customer: [label, subtitle, icon]. */
export const CUSTOMER_STEPS: [string, string, IconName][] = [
  ['Order placed', 'The kitchen has your order', 'receipt_long'],
  ['Preparing', 'Your food is in the oven', 'skillet'],
  ['On the way', 'Marco is riding to you', 'two_wheeler'],
  ['Delivered', 'Enjoy your meal', 'home'],
];

export const RESTAURANT = {
  name: 'Fig & Fennel',
  branch: 'Fig & Fennel, SoHo',
  street: '112 Spring St',
  streetFull: '112 Spring St, SoHo',
  city: '112 Spring St, New York',
  phone: '+1 (212) 555‑0100',
  supportEmail: 'help@figandfennel.example',
  courier: { name: 'Marco Rossi', initials: 'MR', meta: 'Your courier · ★ 4.9 · e‑scooter' },
  chef: 'Chef Lena',
  version: '4.2',
} as const;
