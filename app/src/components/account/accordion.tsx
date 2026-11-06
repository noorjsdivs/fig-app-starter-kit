import { useEffect, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const E = Easing.bezier(0.22, 1, 0.36, 1);

/** Collapsible body: animates height (460ms) and opacity (340ms) like the FAQ `max-height` transition. */
export function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  const [h, setH] = useState(0);
  const p = useSharedValue(open ? 1 : 0);
  useEffect(() => {
    p.set(withTiming(open ? 1 : 0, { duration: open ? 460 : 340, easing: E }));
  }, [open, p]);
  const st = useAnimatedStyle(() => ({ height: h * p.value, opacity: p.value }));
  return (
    <Animated.View style={[{ overflow: 'hidden' }, st]}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0 }} onLayout={(e) => setH(e.nativeEvent.layout.height)}>
        {children}
      </View>
    </Animated.View>
  );
}

/** Chevron that rotates 180° when open. */
export function Rotator({ open, children }: { open: boolean; children: ReactNode }) {
  const r = useSharedValue(open ? 180 : 0);
  useEffect(() => {
    r.set(withTiming(open ? 180 : 0, { duration: 320, easing: E }));
  }, [open, r]);
  const st = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value}deg` }] }));
  return <Animated.View style={st}>{children}</Animated.View>;
}
