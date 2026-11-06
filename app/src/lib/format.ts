/** `$12.50` */
export const money = (n: number): string => '$' + (Math.round(n * 100) / 100).toFixed(2);

/** Initials: "Alex Morgan" → "AM". */
export const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .map((x) => x[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** Count with naive English pluralisation: cnt(1,'dish') → "1 dish", cnt(2,'dish') → "2 dishes". */
export const cnt = (n: number, word: string): string => `${n} ${n === 1 ? word : /(s|sh|ch|x)$/.test(word) ? word + 'es' : word + 's'}`;

export const pad2 = (n: number): string => String(n).padStart(2, '0');

export const firstName = (name: string | undefined | null, fallback = 'there'): string => (name ?? '').trim().split(' ')[0] || fallback;
