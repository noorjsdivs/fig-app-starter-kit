/**
 * Design tokens — a 1:1 port of the CSS custom properties in
 * design/fig-and-fennel.dc.html (`[data-ek]` light and `[data-theme="dark"]`).
 */

export type ThemeName = 'light' | 'dark';

export interface Palette {
  bg: string;
  surface1: string;
  surface2: string;
  line: string;
  lineStrong: string;
  glass: string;
  glassStrong: string;
  glassLine: string;
  navGlass: string;
  navHi: string;
  navLo: string;
  navPill: string;
  navPillHi: string;
  text1: string;
  text2: string;
  text3: string;
  scrim: string;
  ok: string;
  warn: string;
  err: string;
  info: string;
  accent: string;
  accentInk: string;
  accentText: string;
  accentSoft: string;
  /** Solid fallback for glass surfaces where native blur is unavailable (Android). */
  glassSolid: string;
  navSolid: string;
}

export const light: Palette = {
  bg: '#F8F8F6',
  surface1: '#FFFFFF',
  surface2: '#F1F1EE',
  line: 'rgba(26,26,26,0.08)',
  lineStrong: 'rgba(26,26,26,0.16)',
  glass: 'rgba(255,255,255,0.62)',
  glassStrong: 'rgba(255,253,250,0.84)',
  glassLine: 'rgba(26,26,26,0.08)',
  navGlass: 'rgba(255,255,255,0.46)',
  navHi: 'rgba(255,255,255,0.95)',
  navLo: 'rgba(26,26,26,0.08)',
  navPill: 'rgba(255,122,26,0.12)',
  navPillHi: 'rgba(255,255,255,0.75)',
  text1: '#1A1A1A',
  text2: '#55575B',
  text3: '#76787C',
  scrim: 'rgba(26,26,26,0.38)',
  ok: '#2E9E5B',
  warn: '#A86A12',
  err: '#C93434',
  info: '#2563B8',
  accent: '#FF7A1A',
  accentInk: '#FFFFFF',
  accentText: '#C2540A',
  accentSoft: 'rgba(255,122,26,0.12)',
  glassSolid: 'rgba(255,253,250,0.96)',
  navSolid: 'rgba(255,255,255,0.94)',
};

export const dark: Palette = {
  bg: '#141210',
  surface1: '#1E1B18',
  surface2: '#2A2622',
  line: 'rgba(255,255,255,0.08)',
  lineStrong: 'rgba(255,255,255,0.16)',
  glass: 'rgba(30,27,24,0.58)',
  glassStrong: 'rgba(22,20,18,0.82)',
  glassLine: 'rgba(255,255,255,0.12)',
  navGlass: 'rgba(42,38,34,0.42)',
  navHi: 'rgba(255,255,255,0.22)',
  navLo: 'rgba(0,0,0,0.35)',
  navPill: 'rgba(255,255,255,0.12)',
  navPillHi: 'rgba(255,255,255,0.2)',
  text1: '#F8F8F6',
  text2: '#B5ACA1',
  text3: '#8F867B',
  scrim: 'rgba(0,0,0,0.55)',
  ok: '#4CD98A',
  warn: '#F5B93A',
  err: '#FF6B6B',
  info: '#62A8FF',
  accent: '#FF7A1A',
  accentInk: '#FFFFFF',
  accentText: '#FFB27A',
  accentSoft: 'rgba(255,122,26,0.14)',
  glassSolid: 'rgba(30,27,24,0.97)',
  navSolid: 'rgba(42,38,34,0.95)',
};

/** Theme-independent colours used literally in the design. */
export const fixed = {
  ink: '#1C1C1C',
  paper: '#F8F8F6',
  orange: '#FF7A1A',
  peach: '#FFB27A',
  star: '#F5A524',
  white: '#FFFFFF',
  black: '#000000',
  splashBg: '#FBFAF7',
  leaf: '#6FA83A',
  coffee: '#4A2E1E',
  inputFill: '#F3F3F0',
  /** rgba(22,14,8,a) — the warm-black used for photo overlays. */
  roast: (a: number) => `rgba(22,14,8,${a})`,
  paperA: (a: number) => `rgba(248,248,246,${a})`,
  whiteA: (a: number) => `rgba(255,255,255,${a})`,
} as const;

/** `linear-gradient(180deg,#FF9C45 0%,#FF6B0B 100%)` */
export const accentGradient = ['#FF9C45', '#FF6B0B'] as const;

/** Mimics `color-mix(in oklch, <hex> N%, transparent)` for the solid hex tokens. */
export function alpha(color: string, a: number): string {
  if (color.startsWith('rgba(')) {
    return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${a})`);
  }
  const hex = color.replace('#', '');
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export const radius = {
  pill: 999,
} as const;

/** Easing curves from the prototype, as cubic-bezier control points. */
export const curves = {
  /** E — cubic-bezier(.22,1,.36,1) */
  out: [0.22, 1, 0.36, 1] as const,
  /** SP — cubic-bezier(.3,1.32,.5,1) springy overshoot */
  spring: [0.3, 1.32, 0.5, 1] as const,
  /** IO — cubic-bezier(.32,.72,0,1) */
  io: [0.32, 0.72, 0, 1] as const,
  /** OUT — cubic-bezier(.16,1,.3,1) */
  expo: [0.16, 1, 0.3, 1] as const,
};
