import { memo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/theme/theme';

import { GLYPHS, type IconName } from './glyphs';

export type { IconName };

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  /** Material Symbols `FILL` axis: 1 = filled glyph. */
  fill?: boolean | 0 | 1;
  style?: StyleProp<ViewStyle>;
}

/** Material Symbols Rounded glyph (weight 500), rendered as SVG for pixel parity with the design. */
function IconBase({ name, size = 24, color, fill = false, style }: Props) {
  const { c } = useTheme();
  const glyph = GLYPHS[name] ?? GLYPHS.help;
  return (
    <Svg width={size} height={size} viewBox="0 -960 960 960" style={style} pointerEvents="none">
      <Path d={fill ? glyph[1] : glyph[0]} fill={color ?? c.text1} />
    </Svg>
  );
}

export const Icon = memo(IconBase);
