import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { useTheme } from '@/theme/theme';

export interface GlowSpot {
  /** CSS `radial-gradient(<rx%> <ry%> at <cx%> <cy%>, color, transparent)` */
  rx: number;
  ry: number;
  cx: number;
  cy: number;
  color: string;
  opacity: number;
}

/** Soft radial colour washes behind Home / Login / Register / Splash. */
export function Glow({
  spots,
  height,
  dimInDark = true,
}: {
  spots: GlowSpot[];
  height?: number;
  /** Soften the wash on dark backgrounds so muted text stays readable. */
  dimInDark?: boolean;
}) {
  const { width, height: wh } = useWindowDimensions();
  const { isDark } = useTheme();
  const h = height ?? wh;
  const k = isDark && dimInDark ? 0.32 : 1;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={h}>
        <Defs>
          {spots.map((s, i) => (
            <RadialGradient key={i} id={`g${i}`} cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={s.color} stopOpacity={s.opacity * k} />
              <Stop offset="1" stopColor={s.color} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        {spots.map((s, i) => (
          <Ellipse key={i} cx={(s.cx / 100) * width} cy={(s.cy / 100) * h} rx={(s.rx / 100) * width} ry={(s.ry / 100) * h} fill={`url(#g${i})`} />
        ))}
      </Svg>
    </View>
  );
}

/** Home: lime/pistachio wash top-right + top-left. */
export const HOME_GLOW: GlowSpot[] = [
  { rx: 90, ry: 34, cx: 70, cy: 0, color: '#A8D65C', opacity: 0.55 },
  { rx: 70, ry: 26, cx: 10, cy: 4, color: '#D6EC96', opacity: 0.6 },
];

export const LOGIN_GLOW: GlowSpot[] = [
  { rx: 90, ry: 30, cx: 72, cy: 0, color: '#A8D65C', opacity: 0.5 },
  { rx: 60, ry: 24, cx: 8, cy: 6, color: '#D6EC96', opacity: 0.55 },
];

export const REGISTER_GLOW: GlowSpot[] = [
  { rx: 90, ry: 30, cx: 30, cy: 0, color: '#FFBE8C', opacity: 0.5 },
  { rx: 60, ry: 24, cx: 92, cy: 6, color: '#FFD6E4', opacity: 0.6 },
];

export const SPLASH_GLOW: GlowSpot[] = [
  { rx: 80, ry: 40, cx: 50, cy: 26, color: '#FFD6AA', opacity: 0.45 },
  { rx: 70, ry: 30, cx: 50, cy: 100, color: '#D6EC96', opacity: 0.35 },
];
