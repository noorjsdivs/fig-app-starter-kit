import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode, Ref } from 'react';
import { StyleSheet, View, type HostInstance, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/icons/icon';
import { accentGradient, fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';
import type { Weight } from '@/theme/typography';

import { PressableScale } from './pressable-scale';
import { Spinner } from './controls';
import { Txt } from './txt';

/** `background: var(--accent-grad)` as an absolutely-filled gradient. */
export function AccentFill({ radius, style }: { radius?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <LinearGradient
      colors={accentGradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[StyleSheet.absoluteFill, { borderRadius: radius }, style]}
    />
  );
}

interface AccentButtonProps {
  label?: string;
  icon?: IconName;
  iconFill?: boolean;
  iconSize?: number;
  onPress?: () => void;
  height?: number;
  radius?: number;
  fontSize?: number;
  weight?: Weight;
  loading?: boolean;
  loadingLabel?: string;
  /** Visual disabled state (design uses opacity .55 but keeps it tappable). */
  dim?: boolean;
  /** `box-shadow: 0 12px 30px color-mix(accent 30%)` */
  glow?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
  scaleTo?: number;
  ref?: Ref<HostInstance>;
  accessibilityLabel?: string;
}

/** The orange gradient CTA used across the app. */
export function AccentButton({
  label,
  icon,
  iconFill = false,
  iconSize = 20,
  onPress,
  height = 54,
  radius,
  fontSize = 16,
  weight = 700,
  loading,
  loadingLabel,
  dim,
  glow,
  style,
  contentStyle,
  children,
  scaleTo = 0.97,
  ref,
  accessibilityLabel,
}: AccentButtonProps) {
  const r = radius ?? height / 2;
  return (
    <PressableScale
      ref={ref}
      onPress={onPress}
      scaleTo={scaleTo}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={[{ height, borderRadius: r, opacity: dim ? 0.55 : 1 }, glow && styles.glow, style]}
    >
      <AccentFill radius={r} />
      <View style={[styles.content, contentStyle]}>
        {children ?? (
          <>
            {loading ? <Spinner color="#FFFFFF" /> : icon ? <Icon name={icon} size={iconSize} fill={iconFill} color="#FFFFFF" /> : null}
            {(loading ? (loadingLabel ?? label) : label) ? (
              <Txt s={fontSize} w={weight} color="#FFFFFF">
                {loading ? (loadingLabel ?? label) : label}
              </Txt>
            ) : null}
          </>
        )}
      </View>
    </PressableScale>
  );
}

interface OutlineButtonProps {
  label: string;
  icon?: IconName;
  onPress?: () => void;
  height?: number;
  color?: string;
  fontSize?: number;
  weight?: Weight;
  style?: StyleProp<ViewStyle>;
  borderColor?: string;
}

/** `border:1px solid var(--line-strong); background:none` */
export function OutlineButton({ label, icon, onPress, height = 50, color, fontSize = 14.5, weight = 700, style, borderColor }: OutlineButtonProps) {
  const { c } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.outline, { height, borderRadius: height / 2, borderColor: borderColor ?? c.lineStrong }, style]}
    >
      {icon ? <Icon name={icon} size={18} color={color ?? c.text1} /> : null}
      <Txt s={fontSize} w={weight} color={color ?? c.text1}>
        {label}
      </Txt>
    </PressableScale>
  );
}

/** Inverted text-1 / bg pill (Apply, Filters, Kitchen tickets). */
export function InkButton({
  label,
  icon,
  onPress,
  height = 42,
  radius = 16,
  fontSize = 13.5,
  style,
}: {
  label?: string;
  icon?: IconName;
  onPress?: () => void;
  height?: number;
  radius?: number;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.94}
      accessibilityRole="button"
      style={[styles.ink, { height, borderRadius: radius, backgroundColor: c.text1 }, style]}
    >
      {icon ? <Icon name={icon} size={20} fill color={c.bg} /> : null}
      {label ? (
        <Txt s={fontSize} w={700} color={c.bg}>
          {label}
        </Txt>
      ) : null}
    </PressableScale>
  );
}

interface CircleButtonProps {
  icon: IconName;
  onPress?: () => void;
  size?: number;
  iconSize?: number;
  /** 'surface' — surface-1 + line border; 'photo' — dark translucent over imagery; 'soft' — surface-2 */
  variant?: 'surface' | 'photo' | 'soft' | 'accent';
  color?: string;
  fill?: boolean;
  label: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  ref?: Ref<HostInstance>;
}

/** Round icon buttons: back, notifications, call, message… */
export function CircleButton({ icon, onPress, size = 44, iconSize = 22, variant = 'surface', color, fill, label, style, children, ref }: CircleButtonProps) {
  const { c } = useTheme();
  const v: ViewStyle =
    variant === 'photo'
      ? { backgroundColor: fixed.roast(0.38), borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)' }
      : variant === 'soft'
        ? { backgroundColor: c.surface2, borderWidth: 1, borderColor: c.line }
        : variant === 'accent'
          ? {}
          : { backgroundColor: c.surface1, borderWidth: 1, borderColor: c.line };
  const ic = color ?? (variant === 'photo' ? fixed.paper : variant === 'accent' ? '#FFFFFF' : c.text1);
  return (
    <PressableScale
      ref={ref}
      onPress={onPress}
      scaleTo={0.93}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={[{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }, v, style]}
    >
      {variant === 'accent' ? <AccentFill radius={size / 2} /> : null}
      <Icon name={icon} size={iconSize} color={ic} fill={fill} />
      {children}
    </PressableScale>
  );
}

/** Text-only accent link (“See all”, “Change”, “Mark all read”). */
export function LinkButton({
  label,
  onPress,
  size = 13,
  color,
  style,
}: {
  label: string;
  onPress?: () => void;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  return (
    <PressableScale onPress={onPress} scaleTo={0.96} hitSlop={8} style={[{ paddingVertical: 6 }, style]} accessibilityRole="button">
      <Txt s={size} w={700} color={color ?? c.accentText}>
        {label}
      </Txt>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  glow: { backgroundColor: '#FF7A1A', shadowColor: '#FF7A1A', shadowOpacity: 0.3, shadowRadius: 15, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
  outline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1 },
  ink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 18 },
});
