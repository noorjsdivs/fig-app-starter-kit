import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/icons/icon';
import { accentGradient, alpha } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

import { PressableScale } from './pressable-scale';
import { Txt } from './txt';

const SPRING = { damping: 13, stiffness: 220, mass: 0.8 };
const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);

/* ------------------------------------------------------------------ Toggle */

/** 48×28 switch with a springy knob (`tog()` in the design). Purely visual — wrap in a pressable row. */
export function Toggle({ on }: { on: boolean }) {
  const { c } = useTheme();
  const v = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    v.set(withTiming(on ? 1 : 0, { duration: 300, easing: EASE_OUT }));
  }, [on, v]);
  const track = useAnimatedStyle(() => ({ backgroundColor: interpolateColor(v.value, [0, 1], [c.surface2, c.accent]) }));
  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: v.value * 20 }],
    backgroundColor: interpolateColor(v.value, [0, 1], [c.text3, c.accentInk]),
  }));
  return (
    <Animated.View style={[styles.track, track]}>
      <Animated.View style={[styles.knob, knob]} />
    </Animated.View>
  );
}

/** A tappable Toggle (when the switch itself is the button). */
export function ToggleButton({ on, onPress, label }: { on: boolean; onPress: () => void; label: string }) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.94} hitSlop={8} accessibilityRole="switch" accessibilityState={{ checked: on }} accessibilityLabel={label}>
      <Toggle on={on} />
    </PressableScale>
  );
}

/* ------------------------------------------------------------------ Radio */

/** Ring + gradient dot (`sel()` ring/dot). */
export function Radio({ on, size = 20 }: { on: boolean; size?: number }) {
  const { c } = useTheme();
  const s = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    s.set(withSpring(on ? 1 : 0, SPRING));
  }, [on, s]);
  const dot = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: on ? c.accent : c.lineStrong,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View style={[{ width: 10, height: 10, borderRadius: 5, overflow: 'hidden' }, dot]}>
        <LinearGradient colors={accentGradient} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

/* ------------------------------------------------------------------ Check */

/** 24×24 rounded checkbox (extras, kitchen tickets). */
export function Check({ on, size = 24, radius = 8 }: { on: boolean; size?: number; radius?: number }) {
  const { c } = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        borderWidth: 1.5,
        borderColor: on ? c.accent : c.lineStrong,
        backgroundColor: on ? c.accent : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ opacity: on ? 1 : 0 }}>
        <Icon name="check" size={17} color={c.accentInk} />
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ Chip */

export function chipColors(on: boolean, c: ReturnType<typeof useTheme>['c']) {
  return {
    bg: on ? c.accent : c.surface1,
    fg: on ? c.accentInk : c.text1,
    bd: on ? c.accent : c.line,
  };
}

interface ChipProps {
  label: string;
  on: boolean;
  onPress: () => void;
  icon?: IconName;
  height?: number;
  fontSize?: number;
  padH?: number;
  style?: StyleProp<ViewStyle>;
  right?: ReactNode;
}

/** Filter/option pill with the accent "on" state (`chip()` in the design). */
export function Chip({ label, on, onPress, icon, height = 40, fontSize = 14, padH = 16, style, right }: ChipProps) {
  const { c } = useTheme();
  const col = chipColors(on, c);
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.94}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      style={[
        {
          height,
          paddingHorizontal: padH,
          paddingLeft: icon ? padH - 4 : padH,
          borderRadius: height / 2,
          borderWidth: 1,
          borderColor: col.bd,
          backgroundColor: col.bg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={17} color={col.fg} /> : null}
      <Txt s={fontSize} w={600} color={col.fg} numberOfLines={1}>
        {label}
      </Txt>
      {right}
    </PressableScale>
  );
}

/* ------------------------------------------------------------------ Stepper */

/** − qty + pill (`surface-2` track with `surface-1` round buttons). */
export function Stepper({
  value,
  onDec,
  onInc,
  size = 32,
  pad = 3,
  fontSize = 14,
  minWidth = 22,
}: {
  value: number;
  onDec: () => void;
  onInc: () => void;
  size?: number;
  pad?: number;
  fontSize?: number;
  minWidth?: number;
}) {
  const { c } = useTheme();
  const btn = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: c.surface1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, padding: pad, borderRadius: (size + pad * 2) / 2, backgroundColor: c.surface2 }}>
      <PressableScale onPress={onDec} scaleTo={0.9} style={btn} accessibilityLabel="Less" hitSlop={4}>
        <Icon name="remove" size={size > 36 ? 20 : 18} />
      </PressableScale>
      <Txt s={fontSize} w={700} align="center" style={{ minWidth }}>
        {value}
      </Txt>
      <PressableScale onPress={onInc} scaleTo={0.9} style={btn} accessibilityLabel="More" hitSlop={4}>
        <Icon name="add" size={size > 36 ? 20 : 18} />
      </PressableScale>
    </View>
  );
}

/** Round − value + used in admin settings (40px bordered circles). */
export function ValueStepper({
  label,
  onDec,
  onInc,
  size = 40,
  color,
  minWidth = 58,
  fontSize = 14.5,
  display = false,
}: {
  label: string;
  onDec: () => void;
  onInc: () => void;
  size?: number;
  color?: string;
  minWidth?: number;
  fontSize?: number;
  display?: boolean;
}) {
  const { c } = useTheme();
  const btn = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.surface2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <PressableScale onPress={onDec} scaleTo={0.9} style={btn} accessibilityLabel="Less">
        <Icon name="remove" size={18} />
      </PressableScale>
      <Txt s={fontSize} w={display ? 600 : 700} color={color} align="center" style={{ minWidth }}>
        {label}
      </Txt>
      <PressableScale onPress={onInc} scaleTo={0.9} style={btn} accessibilityLabel="More">
        <Icon name="add" size={18} />
      </PressableScale>
    </View>
  );
}

/* ------------------------------------------------------------------ Spinner */

export function Spinner({ color = '#FFFFFF', size = 18 }: { color?: string; size?: number }) {
  const r = useSharedValue(0);
  useEffect(() => {
    r.set(withRepeat(withTiming(360, { duration: 700, easing: Easing.linear }), -1, false));
    return () => cancelAnimation(r);
  }, [r]);
  const st = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value}deg` }] }));
  return (
    <Animated.View style={[{ width: size, height: size, borderRadius: size / 2, borderWidth: 2.5, borderColor: color, borderRightColor: 'transparent' }, st]} />
  );
}

/* ------------------------------------------------------------------ Pulse dot */

/** Live dot with an expanding ring (`@keyframes ek-pulse`). */
export function PulseDot({ color, size = 10, duration = 1600 }: { color: string; size?: number; duration?: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.set(withRepeat(withTiming(1, { duration, easing: Easing.out(Easing.ease) }), -1, false));
    return () => cancelAnimation(p);
  }, [p, duration]);
  const ring = useAnimatedStyle(() => ({ opacity: 0.85 * (1 - p.value), transform: [{ scale: 1 + 1.4 * p.value }] }));
  return (
    <View style={{ width: size, height: size }}>
      <View style={[StyleSheet.absoluteFill, { borderRadius: size / 2, backgroundColor: color }]} />
      <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: size / 2, backgroundColor: color }, ring]} />
    </View>
  );
}

/* ------------------------------------------------------------------ Status pill */

/** Uppercase status badge with a 15% tint of its colour. */
export function StatusPill({
  label,
  color,
  size = 10,
  padH = 8,
  padV = 4,
  radius = 7,
}: {
  label: string;
  color: string;
  size?: number;
  padH?: number;
  padV?: number;
  radius?: number;
}) {
  return (
    <View style={{ paddingHorizontal: padH, paddingVertical: padV, borderRadius: radius, backgroundColor: alpha(color, 0.15) }}>
      <Txt s={size} w={700} ls={0.05} upper color={color} numberOfLines={1}>
        {label}
      </Txt>
    </View>
  );
}

/* ------------------------------------------------------------------ Progress */

/** Rounded progress bar; animates width changes. */
export function ProgressBar({
  pct,
  height = 5,
  track,
  fill,
  gradient,
  delay = 0,
  duration = 600,
}: {
  pct: number;
  height?: number;
  track?: string;
  fill?: string;
  gradient?: boolean;
  delay?: number;
  duration?: number;
}) {
  const { c } = useTheme();
  const w = useSharedValue(0);
  useEffect(() => {
    w.set(withDelay(delay, withTiming(Math.max(0, Math.min(100, pct)), { duration, easing: EASE_OUT })));
  }, [pct, w, delay, duration]);
  const st = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: track ?? c.surface2, overflow: 'hidden' }}>
      <Animated.View style={[{ height: '100%', borderRadius: height / 2, overflow: 'hidden', backgroundColor: gradient ? undefined : (fill ?? c.accent) }, st]}>
        {gradient ? <LinearGradient colors={accentGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} /> : null}
      </Animated.View>
    </View>
  );
}

/* ------------------------------------------------------------------ Pager dots */

/** Carousel indicator: active dot widens (6 → 22px). */
export function PagerDots({
  count,
  index,
  onPick,
  active,
  inactive,
  activeWidth = 22,
  dotWidth = 6,
  height = 6,
}: {
  count: number;
  index: number;
  onPick?: (i: number) => void;
  active?: string;
  inactive?: string;
  activeWidth?: number;
  dotWidth?: number;
  height?: number;
}) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
      {Array.from({ length: count }, (_, i) => (
        <Dot
          key={i}
          on={i === index}
          onPress={onPick ? () => onPick(i) : undefined}
          active={active ?? c.accent}
          inactive={inactive ?? c.lineStrong}
          aw={activeWidth}
          dw={dotWidth}
          h={height}
        />
      ))}
    </View>
  );
}

function Dot({
  on,
  onPress,
  active,
  inactive,
  aw,
  dw,
  h,
}: {
  on: boolean;
  onPress?: () => void;
  active: string;
  inactive: string;
  aw: number;
  dw: number;
  h: number;
}) {
  const v = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    v.set(withTiming(on ? 1 : 0, { duration: 400, easing: EASE_OUT }));
  }, [on, v]);
  const st = useAnimatedStyle(() => ({ width: dw + (aw - dw) * v.value, backgroundColor: interpolateColor(v.value, [0, 1], [inactive, active]) }));
  return (
    <PressableScale onPress={onPress} disabled={!onPress} scaleTo={1} hitSlop={6} accessibilityLabel="Slide">
      <Animated.View style={[{ height: h, borderRadius: h / 2 }, st]} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  track: { width: 48, height: 28, borderRadius: 14, padding: 3 },
  knob: { width: 22, height: 22, borderRadius: 11 },
});
