import { useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';

/** `border-top: 2px dashed …` — drawn with SVG so it renders identically on iOS and Android. */
export function Dashes({
  color,
  thickness = 2,
  dash = 6,
  gap = 5,
  style,
}: {
  color: string;
  thickness?: number;
  dash?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const [w, setW] = useState(0);
  return (
    <View style={[{ height: thickness }, style]} onLayout={(e) => setW(e.nativeEvent.layout.width)} pointerEvents="none">
      {w ? (
        <Svg width={w} height={thickness}>
          <Line x1={0} y1={thickness / 2} x2={w} y2={thickness / 2} stroke={color} strokeWidth={thickness} strokeDasharray={`${dash} ${gap}`} />
        </Svg>
      ) : null}
    </View>
  );
}
