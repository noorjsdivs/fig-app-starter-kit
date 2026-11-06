import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icons/icon';
import { useTheme } from '@/theme/theme';

import { CircleButton, LinkButton } from './buttons';
import { Glass } from './glass';
import { PressableScale } from './pressable-scale';
import { Txt } from './txt';

/* ------------------------------------------------------------------ insets */

/** Vertical metrics that replace the design's fixed 52px status bar / 24px home-indicator offsets. */
export function useChrome() {
  const insets = useSafeAreaInsets();
  const top = Math.max(insets.top, 24);
  /** Floating bars sit 24px from the bottom on a notched iPhone. */
  const floatBottom = Math.max(insets.bottom - 10, 14);
  return {
    insets,
    top,
    /** Content start under the status bar (design: 58px). */
    contentTop: top + 6,
    /** Height of a glass header (design: 52 + 42 + 12). */
    headerHeight: top + 54,
    /** Content start under a glass header (design: 112px). */
    underHeader: top + 60,
    floatBottom,
    /** Bottom padding for scroll content above a floating bar / tab bar (design: 130px). */
    bottomPad: floatBottom + 106,
  };
}

export const goBack = () => {
  if (router.canGoBack()) router.back();
  else router.replace('/home');
};

/* ------------------------------------------------------------------ headers */

interface ScreenHeaderProps {
  title: string;
  titleIcon?: IconName;
  right?: ReactNode;
  onBack?: () => void;
}

/** Sticky glass header: back button + 20px display title (Checkout, My orders, Settings…). */
export function ScreenHeader({ title, titleIcon, right, onBack }: ScreenHeaderProps) {
  const { c } = useTheme();
  const { top } = useChrome();
  return (
    <Glass style={[styles.header, { paddingTop: top, borderBottomColor: c.glassLine }]}>
      <View style={styles.headerRow}>
        <CircleButton icon="arrow_back" size={42} label="Back" onPress={onBack ?? goBack} />
        <View style={styles.headerTitle}>
          {titleIcon ? <Icon name={titleIcon} size={21} fill color={c.accent} /> : null}
          <Txt s={20} w={600} ls={-0.02} numberOfLines={1} style={{ flexShrink: 1 }}>
            {title}
          </Txt>
        </View>
        {right}
      </View>
    </Glass>
  );
}

export { LinkButton as HeaderLink };

/** Floating photo-screen controls: translucent back (+ optional right buttons). */
export function PhotoHeader({ right, onBack }: { right?: ReactNode; onBack?: () => void }) {
  const { top } = useChrome();
  return (
    <View pointerEvents="box-none" style={[styles.photoHeader, { top: top + 2 }]}>
      <CircleButton icon="arrow_back" variant="photo" label="Back" onPress={onBack ?? goBack} />
      <View style={{ flexDirection: 'row', gap: 8 }}>{right}</View>
    </View>
  );
}

/* ------------------------------------------------------------------ bottom bar */

/** Glass dock that floats above the home indicator and holds the primary CTA. */
export function FloatingBar({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  const { floatBottom } = useChrome();
  return (
    <View pointerEvents="box-none" style={[styles.floatWrap, { bottom: floatBottom }]}>
      <View style={styles.floatShadow}>
        <Glass variant="strong" intensity={70} style={[styles.float, { borderColor: c.glassLine }, style]}>
          <View pointerEvents="none" style={[styles.floatHi, { borderTopColor: c.navHi }]} />
          {children}
        </Glass>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ cards */

/** `background:var(--surface-1); border:1px solid var(--line)` rounded container. */
export function Card({ children, style, radius = 22, pad }: { children?: ReactNode; style?: StyleProp<ViewStyle>; radius?: number; pad?: number }) {
  const { c } = useTheme();
  return <View style={[{ backgroundColor: c.surface1, borderWidth: 1, borderColor: c.line, borderRadius: radius, padding: pad }, style]}>{children}</View>;
}

/** Grouped list card that clips row separators. */
export function ListCard({ children, style, radius = 22 }: { children?: ReactNode; style?: StyleProp<ViewStyle>; radius?: number }) {
  const { c } = useTheme();
  return (
    <View style={[{ backgroundColor: c.surface1, borderWidth: 1, borderColor: c.line, borderRadius: radius, overflow: 'hidden' }, style]}>{children}</View>
  );
}

/** Row inside a ListCard: icon tile + title/sub + chevron or custom right. */
export function ListRow({
  icon,
  iconColor,
  iconFill,
  iconBg,
  title,
  sub,
  right,
  onPress,
  last,
  minHeight = 62,
  titleColor,
  tile = 38,
  bare,
}: {
  icon?: IconName;
  iconColor?: string;
  iconFill?: boolean;
  iconBg?: string;
  title: string;
  sub?: string;
  right?: ReactNode;
  onPress?: () => void;
  last?: boolean;
  minHeight?: number;
  titleColor?: string;
  tile?: number;
  /** Render the icon without a tile background. */
  bare?: boolean;
}) {
  const { c } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      disabled={!onPress}
      scaleTo={0.985}
      style={[styles.row, { minHeight, borderBottomWidth: last ? 0 : 1, borderBottomColor: c.line }]}
    >
      {icon ? (
        bare ? (
          <Icon name={icon} size={20} color={iconColor ?? c.text2} fill={iconFill} />
        ) : (
          <View style={{ width: tile, height: tile, borderRadius: 12, backgroundColor: iconBg ?? c.surface2, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={icon} size={21} color={iconColor ?? c.text1} fill={iconFill} />
          </View>
        )
      ) : null}
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Txt s={14.5} w={600} color={titleColor}>
          {title}
        </Txt>
        {sub ? (
          <Txt s={12.5} color={c.text3} numberOfLines={1}>
            {sub}
          </Txt>
        ) : null}
      </View>
      {right === undefined ? <Icon name="chevron_right" size={21} color={c.text3} /> : right}
    </PressableScale>
  );
}

/** Uppercase 11px section eyebrow (“Account”, “Saved addresses”). */
export function Eyebrow({ children, style, color, size = 11 }: { children: ReactNode; style?: StyleProp<ViewStyle>; color?: string; size?: number }) {
  const { c } = useTheme();
  return (
    <View style={style}>
      <Txt s={size} w={700} ls={0.1} upper color={color ?? c.text3}>
        {children}
      </Txt>
    </View>
  );
}

/** Section title row: 21px display title + right slot. */
export function SectionHead({ title, right, size = 21, style }: { title: string; right?: ReactNode; size?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.sectionHead, style]}>
      <Txt s={size} w={600} ls={-0.02}>
        {title}
      </Txt>
      {right}
    </View>
  );
}

/** Small grey meta text for section heads. */
export function Meta({ children }: { children: ReactNode }) {
  const { c } = useTheme();
  return (
    <Txt s={12.5} w={500} color={c.text3}>
      {children}
    </Txt>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  return <View style={[{ height: 1, backgroundColor: c.line }, style]} />;
}

/** Subtotal / Delivery / Total rows. */
export function SummaryRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  const { c } = useTheme();
  return (
    <View style={styles.sumRow}>
      <Txt s={14.5} w={500} color={c.text2}>
        {label}
      </Txt>
      <Txt s={14.5} w={500} color={valueColor}>
        {value}
      </Txt>
    </View>
  );
}

export function TotalRow({ value }: { value: string }) {
  return (
    <View style={[styles.sumRow, { alignItems: 'flex-end' }]}>
      <Txt s={14.5} w={700}>
        Total
      </Txt>
      <Txt s={24} w={600} ls={-0.02}>
        {value}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 0 },
  photoHeader: { position: 'absolute', left: 16, right: 16, zIndex: 3, flexDirection: 'row', justifyContent: 'space-between' },
  floatWrap: { position: 'absolute', left: 12, right: 12, zIndex: 3 },
  floatShadow: { borderRadius: 32, shadowColor: '#1A1A1A', shadowOpacity: 0.16, shadowRadius: 20, shadowOffset: { width: 0, height: 20 }, elevation: 12 },
  float: { borderRadius: 32, borderWidth: 1, padding: 8 },
  floatHi: { ...StyleSheet.absoluteFill, borderRadius: 32, borderTopWidth: 1 },
  card: {},
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16 },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
