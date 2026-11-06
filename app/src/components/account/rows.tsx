import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/icons/icon';
import { Radio, Toggle } from '@/components/ui/controls';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Txt } from '@/components/ui/txt';
import { useTheme } from '@/theme/theme';

/** Full-width row with a switch (Settings, sheets). Tapping anywhere toggles. */
export function ToggleRow({
  title,
  sub,
  on,
  onPress,
  icon,
  last,
  minHeight = 62,
  titleWeight = 600,
}: {
  title: string;
  sub?: string;
  on: boolean;
  onPress: () => void;
  icon?: IconName;
  last?: boolean;
  minHeight?: number;
  titleWeight?: 600 | 700;
}) {
  const { c } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      style={{
        minHeight,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: c.line,
      }}
    >
      {icon ? <Icon name={icon} size={21} color={c.text2} /> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Txt s={14.5} w={titleWeight}>
          {title}
        </Txt>
        {sub ? (
          <Txt s={12} color={c.text3}>
            {sub}
          </Txt>
        ) : null}
      </View>
      <Toggle on={on} />
    </PressableScale>
  );
}

/** Selectable option card with a radio ring (`sel()` — border 1.5 accent + accent-soft bg). */
export function SelectRow({
  on,
  onPress,
  left,
  children,
  minHeight = 56,
  radius = 18,
  pad = 14,
  ringSize = 22,
  style,
}: {
  on: boolean;
  onPress: () => void;
  left?: ReactNode;
  children: ReactNode;
  minHeight?: number;
  radius?: number;
  pad?: number;
  ringSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      accessibilityRole="radio"
      accessibilityState={{ selected: on }}
      style={[
        {
          minHeight,
          paddingHorizontal: pad,
          borderRadius: radius,
          borderWidth: 1.5,
          borderColor: on ? c.accent : c.line,
          backgroundColor: on ? c.accentSoft : c.surface1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        },
        style,
      ]}
    >
      {left}
      <View style={{ flex: 1, minWidth: 0 }}>{children}</View>
      <Radio on={on} size={ringSize} />
    </PressableScale>
  );
}

/** Square icon tile (40–46px) used on option rows. */
export function IconTile({
  icon,
  size = 42,
  radius = 13,
  bg,
  color,
  fill,
  iconSize = 21,
}: {
  icon: IconName;
  size?: number;
  radius?: number;
  bg?: string;
  color?: string;
  fill?: boolean;
  iconSize?: number;
}) {
  const { c } = useTheme();
  return (
    <View style={{ width: size, height: size, borderRadius: radius, backgroundColor: bg ?? c.surface2, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={iconSize} color={color ?? c.text1} fill={fill} />
    </View>
  );
}
