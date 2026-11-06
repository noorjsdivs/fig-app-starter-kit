import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type LayoutChangeEvent, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/icons/icon';
import { AccentFill, CircleButton } from '@/components/ui/buttons';
import { StatusPill, Toggle } from '@/components/ui/controls';
import { Glass } from '@/components/ui/glass';
import { goBack, useChrome } from '@/components/ui/layout';
import { Avatar, DishImage } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Txt } from '@/components/ui/txt';
import { STATUS } from '@/data/seed';
import type { Order, OrderStep } from '@/data/types';
import { cnt, initials, money } from '@/lib/format';
import { useApp } from '@/store/app-store';
import type { Palette } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';
import { family } from '@/theme/typography';

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/* ------------------------------------------------------------------ navigation */

/** Leave the admin console and return to the customer Profile tab. */
export const exitAdmin = () => router.dismissTo('/profile');

/* ------------------------------------------------------------------ header */

/**
 * Admin glass header (design `ADMIN HEADER`, 102px incl. status bar):
 * eco logo tile on tab roots, back button on pushed screens, “FIG ADMIN” eyebrow,
 * 19px title and a “Store” pill that exits to the customer app.
 */
export function AdminHeader({ title, back }: { title: string; back?: boolean }) {
  const { c } = useTheme();
  const { top } = useChrome();
  return (
    <Glass style={[styles.header, { paddingTop: top, borderBottomColor: c.glassLine }]}>
      <View style={styles.headerRow}>
        {back ? (
          <CircleButton icon="arrow_back" size={40} label="Back" onPress={goBack} />
        ) : (
          <View style={styles.logo}>
            <AccentFill radius={13} />
            <Icon name="eco" size={22} fill color={c.accentInk} />
          </View>
        )}
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Txt s={10.5} w={700} ls={0.1} upper color={c.accentText}>
            Fig admin
          </Txt>
          <Txt s={19} w={600} ls={-0.02} numberOfLines={1}>
            {title}
          </Txt>
        </View>
        <PressableScale onPress={exitAdmin} scaleTo={0.94} style={[styles.store, { borderColor: c.lineStrong }]} accessibilityLabel="Back to the store">
          <Icon name="storefront" size={17} />
          <Txt s={12.5} w={600}>
            Store
          </Txt>
        </PressableScale>
      </View>
    </Glass>
  );
}

/* ------------------------------------------------------------------ screen shell */

/** Standard admin scroll padding (design: 112px top, 16px sides). */
export function useAdminPadding(kind: 'tab' | 'push' | 'cta') {
  const chrome = useChrome();
  return {
    paddingTop: chrome.underHeader,
    paddingHorizontal: 16,
    paddingBottom: kind === 'push' ? 40 : chrome.bottomPad,
  };
}

/* ------------------------------------------------------------------ status */

export function statusColor(step: OrderStep, c: Palette): string {
  return [c.info, c.warn, c.accentText, c.ok, c.err][step];
}

export function StepPill({
  step,
  size = 10,
  padH = 8,
  padV = 4,
  radius = 7,
}: {
  step: OrderStep;
  size?: number;
  padH?: number;
  padV?: number;
  radius?: number;
}) {
  const { c } = useTheme();
  return <StatusPill label={STATUS[step]} color={statusColor(step, c)} size={size} padH={padH} padV={padV} radius={radius} />;
}

/* ------------------------------------------------------------------ order row */

/** Order summary used across the admin (`orow` in the design). */
export function useOrderSummary(o: Order) {
  const dishOf = useApp((s) => s.dishOf);
  const n = o.items.reduce((a, b) => a + b.q, 0);
  const first = dishOf(o.items[0]?.id ?? '');
  return {
    img: first.img,
    summary: first.name + (o.items.length > 1 ? ` + ${o.items.length - 1} more` : '') + ' · ' + cnt(n, 'item'),
  };
}

export function openAdminOrder(no: string) {
  router.push({ pathname: '/admin/order/[no]', params: { no } });
}

export const openItemEditor = (id: string | null) => router.push({ pathname: '/admin/item/[id]', params: { id: id ?? 'new' } });
export const openPostEditor = (id: string | null) => router.push({ pathname: '/admin/post/[id]', params: { id: id ?? 'new' } });
export const openBrandEditor = (id: string) => router.push({ pathname: '/admin/brand/[id]', params: { id } });

/**
 * Order row. `variant="queue"` — dish thumbnail with customer first (dashboard live queue);
 * `variant="list"` — initials avatar with order number first (Orders tab).
 */
export function OrderRow({ order, customer, variant = 'list' }: { order: Order; customer: string; variant?: 'queue' | 'list' }) {
  const { c } = useTheme();
  const { img, summary } = useOrderSummary(order);
  return (
    <PressableScale onPress={() => openAdminOrder(order.no)} scaleTo={0.98} style={[styles.row, { borderColor: c.line, backgroundColor: c.surface1 }]}>
      {variant === 'queue' ? <DishImage uri={img} size={50} /> : <Avatar text={initials(customer)} size={42} fontSize={13} />}
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Txt s={14.5} w={700} numberOfLines={1}>
          {variant === 'queue' ? customer : order.no}{' '}
          <Txt s={14.5} w={500} color={c.text3}>
            · {order.time}
          </Txt>
        </Txt>
        <Txt s={12} color={c.text3} numberOfLines={1}>
          {variant === 'queue' ? `${order.no} · ${summary}` : `${customer} · ${summary}`}
        </Txt>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <Txt s={14} w={700}>
          {money(order.total)}
        </Txt>
        <StepPill step={order.step} />
      </View>
    </PressableScale>
  );
}

/* ------------------------------------------------------------------ rows */

/** Card row with a toggle that the whole row controls. */
export function ToggleCardRow({
  title,
  sub,
  on,
  onPress,
  style,
  titleSize = 14.5,
}: {
  title: string;
  sub?: string;
  on: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  titleSize?: number;
}) {
  const { c } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      style={[styles.toggleRow, { borderColor: c.line, backgroundColor: c.surface1 }, style]}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Txt s={titleSize} w={700}>
          {title}
        </Txt>
        {sub ? (
          <Txt s={12.5} color={c.text3}>
            {sub}
          </Txt>
        ) : null}
      </View>
      <Toggle on={on} />
    </PressableScale>
  );
}

/** Two stacked 30×22 reorder buttons. */
export function ReorderButtons({ onUp, onDown, first, last }: { onUp: () => void; onDown: () => void; first: boolean; last: boolean }) {
  const { c } = useTheme();
  const btn = [styles.reorder, { backgroundColor: c.surface2 }];
  return (
    <View style={{ gap: 2 }}>
      <PressableScale onPress={onUp} scaleTo={0.9} style={[btn, { opacity: first ? 0.3 : 1 }]} accessibilityLabel="Move up">
        <Icon name="keyboard_arrow_up" size={18} />
      </PressableScale>
      <PressableScale onPress={onDown} scaleTo={0.9} style={[btn, { opacity: last ? 0.3 : 1 }]} accessibilityLabel="Move down">
        <Icon name="keyboard_arrow_down" size={18} />
      </PressableScale>
    </View>
  );
}

/** Tile icon + title + sub + chevron (More tab). */
export function NavRow({ icon, title, sub, onPress }: { icon: IconName; title: string; sub: string; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <PressableScale onPress={onPress} scaleTo={0.98} style={[styles.navRow, { borderColor: c.line, backgroundColor: c.surface1 }]}>
      <View style={[styles.navTile, { backgroundColor: c.accentSoft }]}>
        <Icon name={icon} size={22} fill color={c.accentText} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Txt s={15} w={700}>
          {title}
        </Txt>
        <Txt s={12.5} color={c.text3}>
          {sub}
        </Txt>
      </View>
      <Icon name="chevron_right" size={22} color={c.text3} />
    </PressableScale>
  );
}

/* ------------------------------------------------------------------ form */

/** 12px uppercase field label (“DISH NAME”). */
export function FieldLabel({ children, right }: { children: ReactNode; right?: ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <Txt s={12} w={600} ls={0.06} upper color={c.text3}>
        {children}
      </Txt>
      {right}
    </View>
  );
}

/** Bordered admin text input (52px, radius 16, 15/600). */
export function AdminInput({
  style,
  multiline,
  minHeight,
  fontWeight = 600,
  fontSize = 15,
  ...rest
}: TextInputProps & { minHeight?: number; fontWeight?: 400 | 500 | 600 | 700; fontSize?: number }) {
  const { c } = useTheme();
  return (
    <TextInput
      placeholderTextColor={c.text3}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      selectionColor={c.accent}
      {...rest}
      style={[
        {
          borderRadius: 16,
          borderWidth: 1,
          borderColor: c.line,
          backgroundColor: c.surface1,
          color: c.text1,
          paddingHorizontal: multiline ? 14 : 16,
          fontFamily: family(fontWeight),
          fontSize,
        },
        multiline
          ? { minHeight: minHeight ?? 72, paddingTop: 12, paddingBottom: 12, lineHeight: Math.round(fontSize * (fontWeight === 400 ? 1.6 : 1.5)) }
          : { height: 52 },
        style,
      ]}
    />
  );
}

/** Search field (48px pill). */
export function SearchField({
  value,
  onChangeText,
  placeholder,
  style,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  return (
    <View style={[styles.search, { borderColor: c.line, backgroundColor: c.surface1 }, style]}>
      <Icon name="search" size={20} color={c.text3} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.text3}
        selectionColor={c.accent}
        style={{ flex: 1, minWidth: 0, fontFamily: family(500), fontSize: 14.5, color: c.text1, paddingVertical: 0 }}
      />
    </View>
  );
}

/** Orange pill action (“New”, “Add”). */
export function AccentPill({ label, icon = 'add', onPress, height = 48 }: { label: string; icon?: IconName; onPress: () => void; height?: number }) {
  const { c } = useTheme();
  return (
    <PressableScale onPress={onPress} scaleTo={0.95} style={[styles.accentPill, { height, borderRadius: height / 2 }]}>
      <AccentFill radius={height / 2} />
      <Icon name={icon} size={20} color={c.accentInk} />
      <Txt s={14} w={700} color={c.accentInk}>
        {label}
      </Txt>
    </PressableScale>
  );
}

/* ------------------------------------------------------------------ misc */

/** 1px dashed rule (`border-bottom: 1px dashed var(--line-strong)`). */
export function DashedLine({ color, style }: { color: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ height: 1, overflow: 'hidden' }, style]}>
      <View style={{ height: 2, borderWidth: 1, borderColor: color, borderStyle: 'dashed', borderRadius: 1 }} />
    </View>
  );
}

/** Height/width that animates from `from` to `to` (bar charts, distribution bars). */
export function GrowBar({
  pct,
  delay,
  axis,
  style,
  from = 0,
}: {
  pct: number;
  delay: number;
  axis: 'height' | 'width';
  style?: StyleProp<ViewStyle>;
  from?: number;
}) {
  const v = useSharedValue(from);
  useEffect(() => {
    v.set(from);
    v.set(withDelay(delay, withTiming(pct, { duration: 800, easing: EASE })));
  }, [pct, delay, v, from]);
  const st = useAnimatedStyle(() => (axis === 'height' ? { height: `${v.value}%` } : { width: `${v.value}%` }));
  return <Animated.View style={[style, st]} />;
}

/**
 * Range input (`<input type=range min max step>` with accent-color):
 * drag or tap anywhere on the track; snaps to `step`.
 */
export function RangeSlider({ min, max, step, value, onChange }: { min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  const { c } = useTheme();
  const [w, setW] = useState(0);
  const thumb = 22;
  const pct = (value - min) / (max - min);
  const usable = Math.max(0, w - thumb);

  const pick = (x: number) => {
    if (!usable) return;
    const t = Math.max(0, Math.min(1, (x - thumb / 2) / usable));
    const v = Math.round((min + t * (max - min)) / step) * step;
    const clamped = Math.max(min, Math.min(max, v));
    if (clamped !== value) onChange(clamped);
  };

  return (
    <View
      style={{ height: 30, justifyContent: 'center' }}
      onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={(e) => pick(e.nativeEvent.locationX)}
      onResponderMove={(e) => pick(e.nativeEvent.locationX)}
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => onChange(Math.max(min, Math.min(max, value + (e.nativeEvent.actionName === 'increment' ? step : -step))))}
    >
      <View pointerEvents="none" style={{ marginHorizontal: thumb / 2, height: 4, borderRadius: 2, backgroundColor: c.surface2, overflow: 'hidden' }}>
        <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: c.accent }} />
      </View>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: pct * usable,
          width: thumb,
          height: thumb,
          borderRadius: thumb / 2,
          backgroundColor: c.accent,
          borderWidth: 3,
          borderColor: c.surface1,
          shadowColor: '#1A1A1A',
          shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, paddingHorizontal: 16, borderBottomWidth: 1 },
  headerRow: { height: 48, flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  store: { height: 36, paddingHorizontal: 12, borderRadius: 18, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 18, borderWidth: 1 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  reorder: { width: 30, height: 22, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 20, borderWidth: 1 },
  navTile: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  search: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14 },
  accentPill: { paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 6 },
});
