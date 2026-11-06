import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View, type HostInstance } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { HeartButton } from '@/components/dish-card';
import { Icon, type IconName } from '@/components/icons/icon';
import { AccentButton, AccentFill, CircleButton } from '@/components/ui/buttons';
import { Check, Stepper, chipColors } from '@/components/ui/controls';
import { Glass } from '@/components/ui/glass';
import { FloatingBar, ListCard, PhotoHeader } from '@/components/ui/layout';
import { DishImage } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { defaultSize, extrasOf, sizesOf } from '@/data/menu';
import { useAddToCart } from '@/hooks/use-cart-actions';
import { useStatusBar } from '@/hooks/use-status-bar';
import { money } from '@/lib/format';
import { unitOf } from '@/lib/pricing';
import { selectCartCount, useApp } from '@/store/app-store';
import { fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

export default function DishScreen() {
  return (
    <RevealScope>
      <DishDetail />
    </RevealScope>
  );
}

function DishDetail() {
  useStatusBar('light');
  const { c } = useTheme();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dish = useApp((s) => s.dishOf(String(id)));
  const sizes = sizesOf(dish.cat);
  const extras = extrasOf(dish.cat);
  const [size, setSize] = useState(defaultSize(dish.cat));
  const [ex, setEx] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addRef = useRef<HostInstance>(null);
  const add = useAddToCart();
  const unit = unitOf(dish, size, ex);

  const zoom = useSharedValue(1.12);
  useEffect(() => {
    zoom.set(withTiming(1, { duration: 1200, easing: Easing.bezier(0.22, 1, 0.36, 1) }));
  }, [zoom]);
  const heroSt = useAnimatedStyle(() => ({ transform: [{ scale: zoom.value }] }));

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  const onAdd = () => {
    if (!dish.avail) return;
    if (add({ id: dish.id, s: size, ex, q: qty }, addRef, 'header')) setAdded(true);
  };

  const stats: { icon: IconName; color: string; fill?: boolean; main: string; sub?: string }[] = [
    { icon: 'star', color: fixed.star, fill: true, main: String(dish.rating), sub: `(${dish.reviews})` },
    { icon: 'schedule', color: c.text2, main: `${dish.time} min` },
    { icon: 'eco', color: c.text2, main: `${dish.kcal} kcal` },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { width }]}>
          <Animated.View style={[StyleSheet.absoluteFill, heroSt]}>
            <DishImage uri={dish.img} />
          </Animated.View>
          <LinearGradient colors={[fixed.roast(0.45), fixed.roast(0), fixed.roast(0), c.bg]} locations={[0, 0.32, 0.62, 1]} style={StyleSheet.absoluteFill} />
        </View>

        <View style={styles.body}>
          <Reveal i={0} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Glass style={[styles.pill, { borderColor: c.glassLine, borderWidth: 1 }]}>
              <Txt s={10.5} w={700} ls={0.08} upper color={c.accentText}>
                {dish.cat}
              </Txt>
            </Glass>
            {dish.tag ? (
              <View style={styles.pill}>
                <AccentFill radius={9} />
                <Txt s={10.5} w={700} ls={0.08} upper color={c.accentInk}>
                  {dish.tag}
                </Txt>
              </View>
            ) : null}
          </Reveal>

          <Reveal i={1} style={styles.titleRow}>
            <Txt s={32} w={600} lh={1.02} ls={-0.03} style={{ flex: 1 }}>
              {dish.name}
            </Txt>
            <Txt s={26} w={600} ls={-0.02} color={c.accentText} style={{ paddingTop: 3 }}>
              {money(unit)}
            </Txt>
          </Reveal>

          <Reveal i={2} style={{ flexDirection: 'row', gap: 8 }}>
            {stats.map((s) => (
              <View key={s.icon} style={[styles.stat, { backgroundColor: c.surface1, borderColor: c.line }]}>
                <Icon name={s.icon} size={18} fill={s.fill} color={s.color} />
                <Txt s={13.5} w={600}>
                  {s.main}
                </Txt>
                {s.sub ? (
                  <Txt s={13.5} w={600} color={c.text3}>
                    {s.sub}
                  </Txt>
                ) : null}
              </View>
            ))}
          </Reveal>

          <Reveal i={3}>
            <Txt s={15} lh={1.6} color={c.text2}>
              {dish.desc}
            </Txt>
          </Reveal>

          <Reveal i={4} style={{ gap: 10 }}>
            <Txt s={19} w={600} ls={-0.01}>
              Size
            </Txt>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {sizes.map((z, i) => {
                const col = chipColors(i === size, c);
                return (
                  <PressableScale
                    key={z.label}
                    onPress={() => setSize(i)}
                    scaleTo={0.95}
                    style={[styles.size, { borderColor: col.bd, backgroundColor: col.bg }]}
                  >
                    <Txt s={15} w={700} color={col.fg}>
                      {z.label}
                    </Txt>
                    <Txt s={11.5} w={500} color={col.fg} style={{ opacity: 0.75 }}>
                      {z.delta === 0 ? 'Standard' : `${z.delta > 0 ? '+' : '−'}${money(Math.abs(z.delta))}`}
                    </Txt>
                  </PressableScale>
                );
              })}
            </View>
          </Reveal>

          <Reveal i={5} style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Txt s={19} w={600} ls={-0.01}>
                Add extras
              </Txt>
              <Txt s={12.5} w={500} color={c.text3}>
                Optional
              </Txt>
            </View>
            <ListCard radius={20}>
              {extras.map((x, i) => {
                const on = ex.includes(x.id);
                return (
                  <PressableScale
                    key={x.id}
                    onPress={() => setEx(on ? ex.filter((k) => k !== x.id) : [...ex, x.id])}
                    scaleTo={0.985}
                    style={[styles.extra, { borderBottomColor: c.line, borderBottomWidth: i === extras.length - 1 ? 0 : 1 }]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                  >
                    <Check on={on} />
                    <Txt s={14.5} w={500} style={{ flex: 1 }}>
                      {x.label}
                    </Txt>
                    <Txt s={13.5} w={600} color={c.text2}>
                      +{money(x.price)}
                    </Txt>
                  </PressableScale>
                );
              })}
            </ListCard>
          </Reveal>
        </View>
      </ScrollView>

      <PhotoHeader
        right={
          <>
            <HeartButton dishId={dish.id} size={44} iconSize={22} variant="photo" />
            <HeaderCart />
          </>
        }
      />

      <FloatingBar style={styles.bar}>
        <Stepper
          value={qty}
          size={42}
          pad={4}
          fontSize={16}
          minWidth={26}
          onDec={() => setQty(Math.max(1, qty - 1))}
          onInc={() => setQty(Math.min(9, qty + 1))}
        />
        <AccentButton
          ref={addRef}
          height={50}
          dim={!dish.avail}
          onPress={onAdd}
          style={{ flex: 1 }}
          contentStyle={styles.addContent}
          accessibilityLabel="Add to cart"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name={added ? 'check' : 'add_shopping_cart'} size={20} color="#FFFFFF" />
            <Txt s={15.5} w={700} color="#FFFFFF">
              {!dish.avail ? 'Sold out tonight' : added ? 'Added to cart' : 'Add to cart'}
            </Txt>
          </View>
          <Txt s={15.5} w={700} color="#FFFFFF">
            {money(unit * qty)}
          </Txt>
        </AccentButton>
      </FloatingBar>
    </View>
  );
}

/** Translucent cart button with a badge that pops when the +1 lands. */
function HeaderCart() {
  const count = useApp(selectCartCount);
  const bump = useApp((s) => s.bump);
  const s = useSharedValue(1);
  const prev = useRef(bump);
  useEffect(() => {
    if (bump !== prev.current) {
      prev.current = bump;
      s.set(withSequence(withTiming(1.45, { duration: 160 }), withSpring(1, { damping: 8, stiffness: 220 })));
    }
  }, [bump, s]);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <CircleButton icon="shopping_bag" variant="photo" label="Cart" onPress={() => router.navigate('/cart')}>
      {count > 0 ? (
        <Animated.View style={[styles.badge, st]}>
          <Txt s={11} w={700} color="#FFFFFF">
            {count}
          </Txt>
        </Animated.View>
      ) : null}
    </CircleButton>
  );
}

const styles = StyleSheet.create({
  hero: { height: 400, overflow: 'hidden', backgroundColor: fixed.ink },
  body: { marginTop: -56, paddingHorizontal: 22, gap: 18 },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9, overflow: 'hidden' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 },
  stat: { flex: 1, height: 52, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  size: { flex: 1, height: 62, borderRadius: 18, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', gap: 2 },
  extra: { minHeight: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addContent: { justifyContent: 'space-between', paddingHorizontal: 18 },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#FF7A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
