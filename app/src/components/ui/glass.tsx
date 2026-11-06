import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/theme';

type Variant = 'strong' | 'normal' | 'nav';

interface Props {
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  /** Override blur intensity (iOS). */
  intensity?: number;
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
}

/**
 * Frosted-glass surface (`backdrop-filter: blur(22px) saturate(1.6)` in the design).
 * iOS renders a native blur with the design's tint on top; Android uses the
 * equivalent near-opaque tint so the UI stays crisp and fast without a blur target.
 */
export function Glass({ variant = 'strong', style, children, intensity, pointerEvents }: Props) {
  const { c, isDark } = useTheme();
  const tint = variant === 'nav' ? c.navGlass : variant === 'strong' ? c.glassStrong : c.glass;
  const flat = StyleSheet.flatten(style) ?? {};
  const radius = {
    borderRadius: flat.borderRadius,
    borderTopLeftRadius: flat.borderTopLeftRadius,
    borderTopRightRadius: flat.borderTopRightRadius,
    borderBottomLeftRadius: flat.borderBottomLeftRadius,
    borderBottomRightRadius: flat.borderBottomRightRadius,
  };

  if (Platform.OS !== 'ios') {
    return (
      <View pointerEvents={pointerEvents} style={[{ backgroundColor: variant === 'nav' ? c.navSolid : c.glassSolid }, style]}>
        {children}
      </View>
    );
  }

  return (
    <View pointerEvents={pointerEvents} style={[{ overflow: 'hidden' }, style]}>
      <BlurView tint={isDark ? 'dark' : 'light'} intensity={intensity ?? (variant === 'nav' ? 60 : 50)} style={[StyleSheet.absoluteFill, radius]} />
      <View style={[StyleSheet.absoluteFill, radius, { backgroundColor: tint }]} />
      {children}
    </View>
  );
}
