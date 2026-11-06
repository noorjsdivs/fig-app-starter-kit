import { useFocusEffect } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

/** Bumps every time the owning screen gains focus so entrances replay like `enter(n)` in the design. */
const EpochContext = createContext(0);

export function RevealScope({ children }: { children: ReactNode }) {
  const [epoch, setEpoch] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setEpoch((e) => e + 1);
    }, []),
  );
  return <EpochContext.Provider value={epoch}>{children}</EpochContext.Provider>;
}

export function useRevealEpoch() {
  return useContext(EpochContext);
}

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const E = Easing.bezier(0.22, 1, 0.36, 1);

interface RevealProps {
  /** Stagger index: delay = 90 + i × 48 ms (design `A(n, i)`). */
  i?: number;
  /** Starting offset; default rises 16px and scales from .985. */
  from?: { x?: number; y?: number; scale?: number };
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  /** Replay key — changes re-run the entrance (e.g. a filter chip). */
  replay?: unknown;
}

/** Staggered entrance: opacity 0→1, translate & scale settle with expo-out easing. */
export function Reveal({ i = 0, from, style, children, replay }: RevealProps) {
  const epoch = useContext(EpochContext);
  const p = useSharedValue(0);
  useEffect(() => {
    p.set(0);
    const delay = 90 + i * 48;
    p.set(withDelay(delay, withTiming(1, { duration: 820, easing: OUT })));
  }, [epoch, i, p, replay]);
  const fx = from?.x ?? 0;
  const fy = from?.y ?? (from?.x ? 0 : 16);
  const fs = from?.scale ?? 0.985;
  const st = useAnimatedStyle(() => {
    const o = Math.min(1, p.value * 1.45);
    return {
      opacity: o,
      transform: [{ translateX: fx * (1 - p.value) }, { translateY: fy * (1 - p.value) }, { scale: fs + (1 - fs) * p.value }],
    };
  });
  return <Animated.View style={[style, st]}>{children}</Animated.View>;
}

/** One-shot entrance flag for bespoke animations (hero zoom, success check…). */
export function useEntered(delay = 40): boolean {
  const epoch = useContext(EpochContext);
  const [done, setDone] = useState(-1);
  useEffect(() => {
    const t = setTimeout(() => setDone(epoch), delay);
    return () => clearTimeout(t);
  }, [epoch, delay]);
  return done === epoch;
}

export { E as EASE_OUT, OUT as EASE_EXPO };
