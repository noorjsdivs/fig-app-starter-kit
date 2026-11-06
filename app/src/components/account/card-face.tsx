import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Gradient } from '@/data/types';

/** 135deg card gradient + the soft decorative circle in the top-right corner. */
export function CardSurface({ bg, children, style }: { bg: Gradient; children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.card, style]}>
      <LinearGradient colors={bg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.orb} />
      {children}
    </View>
  );
}

/** Gold EMV chip (`linear-gradient(135deg,#E8D3A0,#B8995A)`). */
export function CardChip() {
  return <LinearGradient colors={['#E8D3A0', '#B8995A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 42, height: 30, borderRadius: 7 }} />;
}

const styles = StyleSheet.create({
  card: { height: 196, borderRadius: 26, padding: 20, overflow: 'hidden', justifyContent: 'space-between' },
  orb: { position: 'absolute', right: -40, top: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.08)' },
});
