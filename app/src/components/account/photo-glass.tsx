import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

/**
 * Translucent white chip over photography
 * (`background: rgba(255,255,255,.16); backdrop-filter: blur(12–14px)`).
 */
export function PhotoGlass({ children, style, tint = 0.16, border }: { children?: ReactNode; style?: StyleProp<ViewStyle>; tint?: number; border?: number }) {
  return (
    <View
      style={[
        { overflow: 'hidden', backgroundColor: Platform.OS === 'ios' ? undefined : `rgba(255,255,255,${tint + 0.08})` },
        border ? { borderWidth: 1, borderColor: `rgba(255,255,255,${border})` } : null,
        style,
      ]}
    >
      {Platform.OS === 'ios' ? (
        <>
          <BlurView tint="dark" intensity={22} style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(255,255,255,${tint})` }]} />
        </>
      ) : null}
      {children}
    </View>
  );
}
