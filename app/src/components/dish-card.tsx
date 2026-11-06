import { router } from 'expo-router';
import { useEffect, useRef, type ReactNode } from 'react';
import { StyleSheet, View, type HostInstance, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { Icon } from '@/components/icons/icon';
import { AccentFill } from '@/components/ui/buttons';
import { Glass } from '@/components/ui/glass';
import { DishImage } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import type { Dish } from '@/data/types';
import { useQuickAdd } from '@/hooks/use-cart-actions';
import { money } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

/** Heart toggle that pops (scale 1.35) on change. */
export function HeartButton({
  dishId,
  size = 36,
  iconSize = 19,
  variant = 'glass',
  label = 'Save',
}: {
  dishId: string;
  size?: number;
  iconSize?: number;
  variant?: 'glass' | 'photo';
  label?: string;
}) {
  const { c } = useTheme();
  const saved = useApp((s) => s.saved.includes(dishId));
  const toggle = useApp((s) => s.toggleSave);
  const pop = useSharedValue(1);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    pop.set(withSequence(withTiming(1.35, { duration: 140 }), withSpring(1, { damping: 9, stiffness: 240 })));
  }, [saved, pop]);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  const color = saved ? c.accent : variant === 'photo' ? fixed.paper : c.text1;
  const icon = (
    <Animated.View style={st}>
      <Icon name="favorite" size={iconSize} fill={saved} color={color} />
    </Animated.View>
  );
  return (
    <PressableScale onPress={() => toggle(dishId)} scaleTo={0.9} hitSlop={6} accessibilityLabel={label} accessibilityState={{ selected: saved }}>
      {variant === 'photo' ? (
        <View
          style={[
            styles.circle,
            { width: size, height: size, borderRadius: size / 2, backgroundColor: fixed.roast(0.38), borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)' },
          ]}
        >
          {icon}
        </View>
      ) : (
        <Glass style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>{icon}</Glass>
      )}
    </PressableScale>
  );
}

/** Orange “+” quick-add square (40×40, radius 14). */
export function QuickAddButton({
  dishId,
  size = 40,
  radius = 14,
  iconSize = 22,
  soft,
  deal,
  style,
}: {
  dishId: string;
  size?: number;
  radius?: number;
  iconSize?: number;
  soft?: boolean;
  deal?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  const ref = useRef<HostInstance>(null);
  const quick = useQuickAdd();
  return (
    <PressableScale
      ref={ref}
      onPress={() => quick(dishId, ref, { deal })}
      scaleTo={0.93}
      hitSlop={4}
      accessibilityLabel="Add"
      style={[
        { width: size, height: size, borderRadius: radius, alignItems: 'center', justifyContent: 'center', backgroundColor: soft ? c.accentSoft : undefined },
        style,
      ]}
    >
      {soft ? null : <AccentFill radius={radius} />}
      <Icon name="add" size={iconSize} color={soft ? c.accentText : c.accentInk} />
    </PressableScale>
  );
}

/** Glass tag chip used on photos (“BESTSELLER”, journal categories). */
export function PhotoTag({ label, style }: { label: string; style?: StyleProp<ViewStyle> }) {
  return (
    <Glass style={[{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }, style]}>
      <Txt s={10} w={700} ls={0.05} upper>
        {label}
      </Txt>
    </Glass>
  );
}

export const openDish = (id: string) => router.push({ pathname: '/dish/[id]', params: { id } });

/** Grid product card — Popular tonight, Menu and Saved. */
export function DishCard({ dish, compact }: { dish: Dish; /** Saved tab variant: no tag/rating row */ compact?: boolean }) {
  const { c } = useTheme();
  return (
    <PressableScale onPress={() => openDish(dish.id)} scaleTo={0.98} style={[styles.card, { backgroundColor: c.surface1, borderColor: c.line }]}>
      <View style={[styles.media, { backgroundColor: c.surface2 }]}>
        <DishImage uri={dish.img} opacity={dish.avail ? 1 : 0.55} />
        {!compact && dish.tag ? <PhotoTag label={dish.tag} style={styles.tag} /> : null}
        <View style={styles.heart}>
          <HeartButton dishId={dish.id} label={compact ? 'Remove' : 'Save'} />
        </View>
        {!compact && !dish.avail ? (
          <View style={styles.soldOut}>
            <Txt s={10} w={700} ls={0.05} upper color={fixed.paper}>
              Sold out
            </Txt>
          </View>
        ) : null}
      </View>
      <View style={{ gap: 4, paddingHorizontal: 5 }}>
        <Txt s={14.5} w={700} lh={1.25} numberOfLines={2} style={{ minHeight: 36 }}>
          {dish.name}
        </Txt>
        {!compact ? (
          <View style={styles.metaRow}>
            <View style={styles.rating}>
              <Icon name="star" size={15} fill color={fixed.star} />
              <Txt s={12} w={500}>
                {dish.rating}
              </Txt>
            </View>
            <Txt s={12} w={500} color={c.text3}>
              {dish.time} min
            </Txt>
          </View>
        ) : null}
      </View>
      <View style={styles.priceRow}>
        <Txt s={17} w={600} ls={-0.01}>
          {money(dish.price)}
        </Txt>
        <QuickAddButton dishId={dish.id} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderWidth: 1, borderRadius: 22, paddingTop: 7, paddingHorizontal: 7, paddingBottom: 10, gap: 8 },
  media: { height: 124, borderRadius: 16, overflow: 'hidden' },
  tag: { position: 'absolute', left: 8, top: 8 },
  heart: { position: 'absolute', right: 7, top: 7 },
  soldOut: { position: 'absolute', left: 8, bottom: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: fixed.ink },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 5 },
  circle: { alignItems: 'center', justifyContent: 'center' },
});

/** Two-column grid helper (CSS grid minmax(0,1fr) × 2, gap 12). */
export function DishGrid({ dishes, compact, style }: { dishes: Dish[]; compact?: boolean; style?: StyleProp<ViewStyle> }) {
  const rows: Dish[][] = [];
  for (let i = 0; i < dishes.length; i += 2) rows.push(dishes.slice(i, i + 2));
  return (
    <View style={[{ gap: 12, paddingHorizontal: 20 }, style]}>
      {rows.map((r, i) => (
        <View key={r[0].id} style={{ flexDirection: 'row', gap: 12 }}>
          {r.map((d, k) => (
            <GridCell key={d.id} index={i * 2 + k}>
              <DishCard dish={d} compact={compact} />
            </GridCell>
          ))}
          {r.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
    </View>
  );
}

function GridCell({ index, children }: { index: number; children: ReactNode }) {
  return (
    <Reveal i={2 + index} style={{ flex: 1 }}>
      {children}
    </Reveal>
  );
}
