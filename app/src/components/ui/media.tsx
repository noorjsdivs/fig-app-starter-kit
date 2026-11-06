import { Image, type ImageStyle } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/theme';

import { Txt } from './txt';

/**
 * Dish photography is masked to a circle in the design
 * (`[style*="dish=1"] { mask: radial-gradient(circle closest-side, …) }`):
 * whatever box it sits in, the plate is the largest centred circle that fits.
 */
export function DishImage({
  uri,
  size,
  style,
  opacity = 1,
  ring,
}: {
  uri: string;
  /** Fixed diameter. Omit to fill the parent box and use its shortest side. */
  size?: number;
  style?: StyleProp<ViewStyle>;
  opacity?: number;
  /** Optional ring (e.g. category tiles: 3px surface-1). */
  ring?: { width: number; color: string };
}) {
  const [box, setBox] = useState<number | null>(size ?? null);
  const onLayout = (e: LayoutChangeEvent) => {
    if (size) return;
    const { width, height } = e.nativeEvent.layout;
    const d = Math.floor(Math.min(width, height));
    if (d !== box) setBox(d);
  };
  const d = size ?? box;
  return (
    <View
      onLayout={size ? undefined : onLayout}
      style={[size ? { width: size, height: size } : StyleSheet.absoluteFill, styles.center, style]}
      pointerEvents="none"
    >
      {d ? (
        <Image
          source={{ uri }}
          contentFit="cover"
          transition={250}
          cachePolicy="memory-disk"
          recyclingKey={uri}
          style={{
            width: d,
            height: d,
            borderRadius: d / 2,
            opacity,
            borderWidth: ring?.width,
            borderColor: ring?.color,
          }}
        />
      ) : null}
    </View>
  );
}

/** Cover photo (`background-size:cover`) with an optional gradient overlay. */
export function Photo({
  uri,
  style,
  imageStyle,
  overlay,
  overlayDirection = 'vertical',
  overlayLocations,
  radius,
  children,
  opacity = 1,
}: {
  uri: string;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  /** Gradient colour stops drawn over the image. */
  overlay?: readonly [string, string, ...string[]];
  overlayDirection?: 'vertical' | 'horizontal';
  overlayLocations?: readonly [number, number, ...number[]];
  radius?: number;
  children?: ReactNode;
  opacity?: number;
}) {
  const { c } = useTheme();
  return (
    <View style={[{ overflow: 'hidden', borderRadius: radius, backgroundColor: c.surface2 }, style]}>
      <Image
        source={{ uri }}
        contentFit="cover"
        transition={250}
        cachePolicy="memory-disk"
        recyclingKey={uri}
        style={[StyleSheet.absoluteFill, { opacity }, imageStyle]}
      />
      {overlay ? (
        <LinearGradient
          colors={overlay}
          locations={overlayLocations}
          start={overlayDirection === 'horizontal' ? { x: 0, y: 0.5 } : { x: 0.5, y: 0 }}
          end={overlayDirection === 'horizontal' ? { x: 1, y: 0.5 } : { x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {children}
    </View>
  );
}

/** Small circular avatar with initials. */
export function Avatar({
  text,
  size = 44,
  bg,
  color,
  fontSize,
  display,
}: {
  text: string;
  size?: number;
  bg?: string;
  color?: string;
  fontSize?: number;
  display?: boolean;
}) {
  const { c } = useTheme();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg ?? c.surface2, alignItems: 'center', justifyContent: 'center' }}>
      <Txt s={fontSize ?? Math.round(size * 0.3)} w={display ? 600 : 700} color={color ?? c.text1}>
        {text}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
