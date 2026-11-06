import * as Haptics from 'expo-haptics';
import type { ReactNode, Ref } from 'react';
import { Platform, Pressable, type HostInstance, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const APressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, 'style' | 'children'> {
  /** Scale while pressed (design `style-active="transform:scale(.94)"`). Use 1 to disable. */
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  haptic?: boolean;
  ref?: Ref<HostInstance>;
}

/**
 * Press feedback matching the prototype: scale down in 120ms, spring back with
 * a slight overshoot (cubic-bezier(.3,1.32,.5,1) ≈ damped spring).
 */
export function PressableScale({ scaleTo = 0.96, style, children, onPressIn, onPressOut, onPress, haptic, ref, ...rest }: PressableScaleProps) {
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <APressable
      ref={ref}
      {...rest}
      onPressIn={(e) => {
        if (scaleTo !== 1) s.set(withTiming(scaleTo, { duration: 120 }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        if (scaleTo !== 1) s.set(withSpring(1, { damping: 11, stiffness: 260, mass: 0.7 }));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic && Platform.OS !== 'web') Haptics.selectionAsync().catch(() => undefined);
        onPress?.(e);
      }}
      style={[style, anim]}
    >
      {children}
    </APressable>
  );
}
