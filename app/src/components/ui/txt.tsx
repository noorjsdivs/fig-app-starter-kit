import { Platform, Text, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/theme/theme';
import { family, type Weight } from '@/theme/typography';

export interface TxtProps extends TextProps {
  /** font-size in px */
  s?: number;
  /** font-weight */
  w?: Weight;
  /** line-height as a multiple of the font size (CSS unitless line-height) */
  lh?: number;
  /** letter-spacing in em (CSS `letter-spacing: -0.02em` → -0.02) */
  ls?: number;
  color?: string;
  align?: TextStyle['textAlign'];
  upper?: boolean;
  tabular?: boolean;
  strike?: boolean;
}

/** Outfit text with the design's `font: <w> <s>px/<lh>` shorthand semantics. */
export function Txt({ s = 14, w = 400, lh, ls, color, align, upper, tabular, strike, style, ...rest }: TxtProps) {
  const { c } = useTheme();
  const t: TextStyle = {
    fontFamily: family(w),
    fontSize: s,
    color: color ?? c.text1,
    ...(lh ? { lineHeight: Math.round(s * Math.max(lh, 1.08)) } : null),
    ...(ls ? { letterSpacing: ls * s } : null),
    ...(align ? { textAlign: align } : null),
    ...(upper ? { textTransform: 'uppercase' as const } : null),
    ...(tabular ? { fontVariant: ['tabular-nums' as const] } : null),
    ...(strike ? { textDecorationLine: 'line-through' as const } : null),
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  };
  return <Text allowFontScaling={false} {...rest} style={[t, style]} />;
}
