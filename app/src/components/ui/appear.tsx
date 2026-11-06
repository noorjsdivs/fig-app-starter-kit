import { useEffect, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';

export const EASINGS = {
  /** E — cubic-bezier(.22,1,.36,1) */
  out: Easing.bezier(0.22, 1, 0.36, 1),
  /** OUT — cubic-bezier(.16,1,.3,1) */
  expo: Easing.bezier(0.16, 1, 0.3, 1),
  /** IO — cubic-bezier(.32,.72,0,1) */
  io: Easing.bezier(0.32, 0.72, 0, 1),
  linear: Easing.linear,
  slow: Easing.bezier(0.1, 0.4, 0.3, 1),
} as const;

export interface AppearFrom {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  opacity?: number;
}

interface Props {
  on: boolean;
  from: AppearFrom;
  /** End state (defaults to identity / opaque). */
  to?: AppearFrom;
  delay?: number;
  duration?: number;
  /** Separate duration for opacity (CSS often fades faster than it moves). */
  fadeDuration?: number;
  easing?: keyof typeof EASINGS | 'spring';
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
}

/** Declarative two-state transition (the prototype's `on ? 'none' : 'translateY(…)'` + CSS transition). */
export function Appear({ on, from, to, delay = 0, duration = 600, fadeDuration, easing = 'out', style, children, pointerEvents }: Props) {
  const p = useSharedValue(on ? 1 : 0);
  const o = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    const target = on ? 1 : 0;
    const anim =
      easing === 'spring' ? withSpring(target, { damping: 11, stiffness: 150, mass: 0.9 }) : withTiming(target, { duration, easing: EASINGS[easing] });
    p.set(withDelay(delay, anim));
    o.set(withDelay(delay, withTiming(target, { duration: fadeDuration ?? Math.min(duration, 400), easing: EASINGS.out })));
  }, [on, delay, duration, fadeDuration, easing, p, o]);

  const f = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 0, ...from };
  const t = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, ...to };
  const st = useAnimatedStyle(() => {
    const k = p.value;
    return {
      opacity: f.opacity + (t.opacity - f.opacity) * Math.min(1, Math.max(0, o.value)),
      transform: [
        { translateX: f.x + (t.x - f.x) * k },
        { translateY: f.y + (t.y - f.y) * k },
        { scale: f.scale + (t.scale - f.scale) * k },
        { rotate: `${f.rotate + (t.rotate - f.rotate) * k}deg` },
      ],
    };
  });
  return (
    <Animated.View pointerEvents={pointerEvents} style={[style, st]}>
      {children}
    </Animated.View>
  );
}
