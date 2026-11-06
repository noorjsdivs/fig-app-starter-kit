import { router, useIsFocused } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type HostInstance,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';

import { DishGrid, openDish, PhotoTag, QuickAddButton } from '@/components/dish-card';
import { Icon } from '@/components/icons/icon';
import { AccentFill, LinkButton } from '@/components/ui/buttons';
import { PagerDots, ProgressBar, PulseDot } from '@/components/ui/controls';
import { Meta, SectionHead } from '@/components/ui/layout';
import { DishImage, Photo } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { CUSTOMER_STEPS } from '@/data/content';
import { POPULAR_IDS } from '@/data/menu';
import type { Banner } from '@/data/types';
import { useQuickAdd } from '@/hooks/use-cart-actions';
import { useNow } from '@/hooks/use-simulation';
import { secondsToMidnight } from '@/lib/dates';
import { cnt, money, pad2 } from '@/lib/format';
import { selectBanners, selectLiveMenu, selectMyOrders, stepLabel, useApp } from '@/store/app-store';
import { alpha, fixed } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

const goMenu = (cat: string, brand: string | null = null) => {
  useApp.getState().setMenuCat(cat, brand);
  router.navigate('/menu');
};

/* ------------------------------------------------------------------ Active order */

export function ActiveOrderCard() {
  const prep = useApp((s) => s.prep);
  const active = useApp((s) => selectMyOrders(s).find((o) => o.step < 3));
  if (!active) return null;
  const eta = active.step >= 3 ? 'Delivered' : `${[prep + 12, prep, 9][active.step]} min`;
  return (
    <Reveal i={2} style={{ marginTop: 14, marginHorizontal: 20 }}>
      <PressableScale onPress={() => router.push({ pathname: '/track/[no]', params: { no: active.no } })} scaleTo={0.98} style={styles.active}>
        <View style={styles.activeRow}>
          <PulseDot color={fixed.orange} />
          <View style={{ flex: 1, gap: 2 }}>
            <Txt s={14.5} w={700} color={fixed.paper}>
              {stepLabel(active, active.step)} · {active.no}
            </Txt>
            <Txt s={12.5} color={fixed.paperA(0.72)}>
              {CUSTOMER_STEPS[active.step][1]}
            </Txt>
          </View>
          <Txt s={20} w={600} color={fixed.peach}>
            {eta}
          </Txt>
        </View>
        <ProgressBar pct={((active.step + 1) / 4) * 100} track="rgba(255,255,255,0.14)" fill={fixed.orange} duration={900} />
      </PressableScale>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ Hero carousel */

export function HeroCarousel() {
  const banners = useApp(useShallow(selectBanners));
  const { width } = useWindowDimensions();
  const cardW = width - 40;
  const ref = useRef<ScrollViewInstance>(null);
  const [index, setIndex] = useState(0);
  const touched = useRef(0);
  const focused = useIsFocused();
  const count = banners.length;

  useEffect(() => {
    if (!focused || count < 2) return;
    const id = setInterval(() => {
      if (Date.now() - touched.current < 6000) return;
      setIndex((i) => {
        const n = (i + 1) % count;
        ref.current?.scrollTo({ x: n * cardW, animated: true });
        return n;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [focused, count, cardW]);

  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / cardW));
  };

  return (
    <Reveal i={2} style={{ marginTop: 16, marginHorizontal: 20 }}>
      <View style={styles.hero}>
        <ScrollView
          ref={ref}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={() => {
            touched.current = Date.now();
          }}
          onMomentumScrollEnd={onEnd}
          decelerationRate="fast"
        >
          {banners.map((b) => (
            <HeroSlide key={b.id} banner={b} width={cardW} />
          ))}
        </ScrollView>
      </View>
      <View style={{ marginTop: 12 }}>
        <PagerDots
          count={count}
          index={index >= count ? 0 : index}
          onPick={(i) => {
            touched.current = Date.now();
            setIndex(i);
            ref.current?.scrollTo({ x: i * cardW, animated: true });
          }}
        />
      </View>
    </Reveal>
  );
}

function HeroSlide({ banner, width }: { banner: Banner; width: number }) {
  const go = () => (banner.dish ? openDish(banner.dish) : goMenu(banner.cat ?? 'All'));
  return (
    <Photo
      uri={banner.img}
      style={{ width, height: 196 }}
      overlay={[fixed.roast(0.82), fixed.roast(0.45), fixed.roast(0.1)]}
      overlayLocations={[0, 0.58, 1]}
      overlayDirection="horizontal"
    >
      <View style={styles.heroBody}>
        <View style={{ maxWidth: '66%', gap: 8 }}>
          <View style={styles.heroEb}>
            <Txt s={10} w={700} ls={0.08} upper color={fixed.paper}>
              {banner.eb}
            </Txt>
          </View>
          <Txt s={26} w={600} lh={1.02} ls={-0.025} color={fixed.paper}>
            {banner.title}
          </Txt>
        </View>
        <PressableScale onPress={go} scaleTo={0.94} style={styles.heroCta}>
          <Txt s={13.5} w={700} color="#FFFFFF">
            {banner.cta}
          </Txt>
          <Icon name="arrow_forward" size={18} color="#FFFFFF" />
        </PressableScale>
      </View>
    </Photo>
  );
}

/* ------------------------------------------------------------------ Reserve banner */

export function ReserveBanner() {
  return (
    <Reveal i={3} style={{ marginTop: 18, marginHorizontal: 20 }}>
      <PressableScale onPress={() => router.push('/reserve')} scaleTo={0.98}>
        <Photo
          uri="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1100&q=80"
          radius={24}
          style={{ height: 100 }}
          overlay={[fixed.roast(0.88), fixed.roast(0.3)]}
          overlayDirection="horizontal"
        >
          <View style={styles.reserveText}>
            <Txt s={10.5} w={700} ls={0.1} upper color={fixed.peach}>
              Dine in
            </Txt>
            <Txt s={21} w={600} ls={-0.02} color={fixed.paper}>
              Book a table tonight
            </Txt>
            <Txt s={12.5} w={500} color={fixed.paperA(0.8)}>
              Patio & chef’s counter from 5:30 PM
            </Txt>
          </View>
          <View style={styles.reserveArrow}>
            <Icon name="arrow_forward" size={21} color={fixed.paper} />
          </View>
        </Photo>
      </PressableScale>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ Categories */

export function CategoryStrip() {
  const { c } = useTheme();
  const cats = useApp(useShallow((s) => s.cats.filter((x) => x.on).map((x) => x.name)));
  const menu = useApp((s) => s.menu);
  return (
    <View>
      <Reveal i={3}>
        <SectionHead title="Categories" style={{ marginTop: 22, marginBottom: 12 }} right={<LinkButton label="See all" onPress={() => goMenu('All')} />} />
      </Reveal>
      <Reveal i={3}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingBottom: 4 }}>
          {cats.map((cat) => {
            const img = menu.find((m) => m.cat === cat)?.img;
            return (
              <PressableScale key={cat} onPress={() => goMenu(cat, null)} scaleTo={0.94} style={{ width: 74, alignItems: 'center', gap: 7 }}>
                <View style={[styles.catShadow, { backgroundColor: c.surface1 }]}>
                  {img ? <DishImage uri={img} size={68} ring={{ width: 3, color: c.surface1 }} /> : null}
                </View>
                <Txt s={13} w={600} numberOfLines={1}>
                  {cat}
                </Txt>
              </PressableScale>
            );
          })}
        </ScrollView>
      </Reveal>
    </View>
  );
}

/* ------------------------------------------------------------------ Popular */

export function PopularGrid() {
  const live = useApp(useShallow(selectLiveMenu));
  const dishes = POPULAR_IDS.map((id) => live.find((m) => m.id === id)).filter((d): d is NonNullable<typeof d> => !!d);
  return (
    <View>
      <Reveal i={4}>
        <SectionHead title="Popular tonight" style={{ marginTop: 24, marginBottom: 12 }} right={<Meta>Most ordered</Meta>} />
      </Reveal>
      <DishGrid dishes={dishes} />
    </View>
  );
}

/* ------------------------------------------------------------------ Brands */

export function BrandStrip() {
  const brands = useApp(useShallow((s) => s.brands.filter((b) => b.on)));
  const live = useApp(useShallow(selectLiveMenu));
  return (
    <View>
      <Reveal i={5}>
        <SectionHead title="Our kitchens" style={{ marginTop: 24, marginBottom: 12 }} right={<Meta>Five brands, one oven</Meta>} />
      </Reveal>
      <Reveal i={5}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingBottom: 4 }}>
          {brands.map((b) => (
            <PressableScale key={b.id} onPress={() => goMenu('All', b.id)} scaleTo={0.97}>
              <Photo uri={b.img} radius={24} style={{ width: 232, height: 132 }} overlay={[fixed.roast(0.05), fixed.roast(0.82)]}>
                <View style={styles.brandIcon}>
                  <Icon name={b.icon} size={21} fill color={fixed.paper} />
                </View>
                <View style={styles.brandCount}>
                  <Txt s={10.5} w={700} color={fixed.paper}>
                    {cnt(live.filter((m) => m.brand === b.id).length, 'dish')}
                  </Txt>
                </View>
                <View style={styles.brandText}>
                  <Txt s={18} w={600} lh={1.1} ls={-0.02} color={fixed.paper}>
                    {b.name}
                  </Txt>
                  <Txt s={12} w={500} color={fixed.paperA(0.82)}>
                    {b.tag}
                  </Txt>
                </View>
              </Photo>
            </PressableScale>
          ))}
        </ScrollView>
      </Reveal>
    </View>
  );
}

/* ------------------------------------------------------------------ Deal of the day */

export function DealCard() {
  const deal = useApp((s) => s.deal);
  const dish = useApp((s) => s.menu.find((m) => m.id === s.deal.id) ?? s.menu[0]);
  const focused = useIsFocused();
  const now = useNow(focused);
  const left = secondsToMidnight(now);
  const time = [pad2(Math.floor(left / 3600)), pad2(Math.floor((left % 3600) / 60)), pad2(left % 60)];
  return (
    <Reveal i={5} style={{ marginTop: 24, marginHorizontal: 20 }}>
      <PressableScale onPress={() => openDish(dish.id)} scaleTo={0.98} style={styles.deal}>
        <View style={styles.dealMedia}>
          <DishImage uri={dish.img} />
          <View style={styles.dealPct}>
            <Txt s={14} w={600} color="#FFFFFF">
              −{deal.pct}%
            </Txt>
          </View>
        </View>
        <View style={styles.dealBody}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="bolt" size={15} fill color={fixed.peach} />
            <Txt s={10.5} w={700} ls={0.1} upper color={fixed.peach}>
              Deal of the day
            </Txt>
          </View>
          <Txt s={18} w={600} lh={1.1} ls={-0.02} color={fixed.paper}>
            {dish.name}
          </Txt>
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            {time.map((v, i) => (
              <View key={i} style={styles.dealTime}>
                <Txt s={13} w={700} tabular color={fixed.paper}>
                  {v}
                </Txt>
              </View>
            ))}
            <Txt s={11} w={500} color={fixed.paperA(0.6)} style={{ marginLeft: 4 }}>
              left
            </Txt>
          </View>
          <View style={styles.dealFoot}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <Txt s={20} w={600} color={fixed.peach}>
                {money(dish.price * (1 - deal.pct / 100))}
              </Txt>
              <Txt s={12.5} w={500} strike color={fixed.paperA(0.55)}>
                {money(dish.price)}
              </Txt>
            </View>
            <DealAdd dishId={dish.id} />
          </View>
        </View>
      </PressableScale>
    </Reveal>
  );
}

function DealAdd({ dishId }: { dishId: string }) {
  const ref = useRef<HostInstance>(null);
  const quick = useQuickAdd();
  return (
    <PressableScale ref={ref} onPress={() => quick(dishId, ref, { deal: true })} scaleTo={0.93} accessibilityLabel="Add deal" style={styles.dealAdd}>
      <Icon name="add" size={22} color="#FFFFFF" />
    </PressableScale>
  );
}

/* ------------------------------------------------------------------ Order again */

export function OrderAgain() {
  const { c } = useTheme();
  const orders = useApp(
    useShallow((s) =>
      selectMyOrders(s)
        .filter((o) => o.step === 3)
        .slice(0, 3),
    ),
  );
  const dishOf = useApp((s) => s.dishOf);
  const reorder = useApp((s) => s.reorder);
  return (
    <View>
      <Reveal i={6}>
        <SectionHead title="Order again" style={{ marginTop: 24, marginBottom: 12 }} right={<Meta>One tap reorder</Meta>} />
      </Reveal>
      <Reveal i={6}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingBottom: 4 }}>
          {orders.map((o) => (
            <View key={o.no} style={[styles.again, { backgroundColor: c.surface1, borderColor: c.line }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  {o.items.slice(0, 3).map((it, k) => (
                    <View key={k} style={{ marginLeft: k ? -14 : 0, borderRadius: 21, borderWidth: 2, borderColor: c.surface1 }}>
                      <DishImage uri={dishOf(it.id).img} size={38} />
                    </View>
                  ))}
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
                  <Txt s={13.5} w={700}>
                    {o.no}
                  </Txt>
                  <Txt s={11.5} color={c.text3}>
                    {o.time} · {money(o.total)}
                  </Txt>
                </View>
              </View>
              <Txt s={12.5} w={500} lh={1.4} color={c.text2} numberOfLines={1}>
                {o.items.map((it) => dishOf(it.id).name).join(', ')}
              </Txt>
              <PressableScale onPress={() => reorder(o.no)} scaleTo={0.96} style={[styles.reorder, { borderColor: c.lineStrong }]}>
                <Icon name="replay" size={18} />
                <Txt s={13} w={700}>
                  Reorder
                </Txt>
              </PressableScale>
            </View>
          ))}
        </ScrollView>
      </Reveal>
    </View>
  );
}

/* ------------------------------------------------------------------ Top rated */

export function TopRated() {
  const { c } = useTheme();
  const live = useApp(useShallow(selectLiveMenu));
  const rated = [...live].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 4);
  return (
    <View>
      <Reveal i={7}>
        <SectionHead
          title="Top rated"
          style={{ marginTop: 24, marginBottom: 12 }}
          right={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Icon name="star" size={15} fill color={fixed.star} />
              <Txt s={12.5} w={600} color={c.text3}>
                By our guests
              </Txt>
            </View>
          }
        />
      </Reveal>
      <Reveal i={7} style={{ marginHorizontal: 20 }}>
        <View style={[styles.ratedCard, { backgroundColor: c.surface1, borderColor: c.line }]}>
          {rated.map((m, i) => (
            <PressableScale
              key={m.id}
              onPress={() => openDish(m.id)}
              scaleTo={0.985}
              style={[styles.ratedRow, { borderBottomColor: c.line, borderBottomWidth: i === rated.length - 1 ? 0 : 1 }]}
            >
              <Txt s={15} w={600} color={c.text3} style={{ width: 22 }}>
                0{i + 1}
              </Txt>
              <DishImage uri={m.img} size={54} />
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <Txt s={14.5} w={700} numberOfLines={1}>
                  {m.name}
                </Txt>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="star" size={14} fill color={fixed.star} />
                  <Txt s={12} w={700}>
                    {m.rating}
                  </Txt>
                  <Txt s={12} w={500} color={c.text3}>
                    · {m.reviews} reviews
                  </Txt>
                </View>
              </View>
              <Txt s={15} w={600}>
                {money(m.price)}
              </Txt>
              <QuickAddButton dishId={m.id} size={36} radius={12} iconSize={20} soft />
            </PressableScale>
          ))}
        </View>
      </Reveal>
    </View>
  );
}

/* ------------------------------------------------------------------ Journal */

export function JournalTeasers() {
  const { c } = useTheme();
  const posts = useApp(
    useShallow((s) =>
      s.posts
        .filter((p) => p.on)
        .sort((a, b) => Number(b.featured) - Number(a.featured))
        .slice(0, 4),
    ),
  );
  return (
    <View>
      <Reveal i={8}>
        <SectionHead
          title="From the journal"
          style={{ marginTop: 24, marginBottom: 12 }}
          right={<LinkButton label="Read all" onPress={() => router.push('/journal')} />}
        />
      </Reveal>
      <Reveal i={8}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingBottom: 4 }}>
          {posts.map((p) => (
            <PressableScale
              key={p.id}
              onPress={() => router.push({ pathname: '/journal/[id]', params: { id: p.id } })}
              scaleTo={0.98}
              style={[styles.post, { backgroundColor: c.surface1, borderColor: c.line }]}
            >
              <Photo uri={p.img} radius={16} style={{ height: 140 }}>
                <PhotoTag label={p.cat} style={{ position: 'absolute', left: 8, top: 8 }} />
              </Photo>
              <Txt s={16} w={600} lh={1.2} ls={-0.015} numberOfLines={2} style={{ paddingHorizontal: 7 }}>
                {p.title}
              </Txt>
              <Txt s={12} w={500} color={c.text3} style={{ paddingHorizontal: 7 }}>
                {p.author} · {p.mins} min read
              </Txt>
            </PressableScale>
          ))}
        </ScrollView>
      </Reveal>
    </View>
  );
}

/* ------------------------------------------------------------------ Mode toggle */

export function ModeToggle() {
  const { c } = useTheme();
  const { mode, prep, addr } = useApp(useShallow((s) => ({ mode: s.mode, prep: s.prep, addr: (s.addrs[s.addr] ?? s.addrs[0]).l1 })));
  const setMode = useApp((s) => s.setMode);
  const x = useSharedValue(mode === 'pickup' ? 1 : 0);
  useEffect(() => {
    x.set(withSpring(mode === 'pickup' ? 1 : 0, { damping: 14, stiffness: 190, mass: 0.8 }));
  }, [mode, x]);
  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value * 96 }] }));
  const item = (m: 'delivery' | 'pickup', icon: 'two_wheeler' | 'storefront', label: string) => {
    const on = mode === m;
    return (
      <PressableScale onPress={() => setMode(m)} scaleTo={0.96} style={styles.modeBtn} accessibilityState={{ selected: on }}>
        <Icon name={icon} size={17} color={on ? c.accentInk : c.text2} />
        <Txt s={13} w={700} color={on ? c.accentInk : c.text2}>
          {label}
        </Txt>
      </PressableScale>
    );
  };
  return (
    <Reveal i={1} style={{ marginTop: 12, marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={[styles.mode, { backgroundColor: c.surface2 }]}>
        <Animated.View style={[styles.modePill, pill]}>
          <AccentFill radius={17} />
        </Animated.View>
        {item('delivery', 'two_wheeler', 'Delivery')}
        {item('pickup', 'storefront', 'Pickup')}
      </View>
      <Txt s={12.5} w={500} lh={1.3} color={c.text3} numberOfLines={1} style={{ flex: 1, minWidth: 0 }}>
        {mode === 'pickup' ? `Ready in ~${prep} min` : addr}
      </Txt>
    </Reveal>
  );
}

export function StoreClosedBanner() {
  const { c } = useTheme();
  const open = useApp((s) => s.storeOpen);
  if (open) return null;
  return (
    <View style={[styles.closed, { backgroundColor: alpha(c.err, 0.12) }]}>
      <Icon name="schedule" size={22} fill color={c.err} />
      <View style={{ gap: 2, flex: 1 }}>
        <Txt s={14} w={700}>
          The kitchen is closed
        </Txt>
        <Txt s={12.5} color={c.text2}>
          Browse the menu. Ordering reopens at 11:00 AM.
        </Txt>
      </View>
    </View>
  );
}

export function useHasDelivered() {
  return useApp((s) => selectMyOrders(s).some((o) => o.step === 3));
}

const styles = StyleSheet.create({
  active: { padding: 14, borderRadius: 20, backgroundColor: fixed.ink, gap: 10 },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hero: { height: 196, borderRadius: 26, overflow: 'hidden' },
  heroBody: { flex: 1, padding: 18, justifyContent: 'space-between' },
  heroEb: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroCta: {
    alignSelf: 'flex-start',
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: fixed.orange,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reserveText: { position: 'absolute', left: 18, top: 0, bottom: 0, justifyContent: 'center', gap: 5 },
  reserveArrow: {
    position: 'absolute',
    right: 16,
    top: 28,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catShadow: {
    width: 68,
    height: 68,
    borderRadius: 34,
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  brandIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandCount: { position: 'absolute', right: 12, top: 14, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 9, backgroundColor: fixed.roast(0.5) },
  brandText: { position: 'absolute', left: 14, right: 14, bottom: 12, gap: 2 },
  deal: { flexDirection: 'row', borderRadius: 26, overflow: 'hidden', backgroundColor: fixed.ink },
  dealMedia: { width: 142, minHeight: 168 },
  dealPct: { position: 'absolute', left: 10, top: 10, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: fixed.orange },
  dealBody: { flex: 1, minWidth: 0, paddingVertical: 14, paddingRight: 14, paddingLeft: 16, gap: 8 },
  dealTime: {
    minWidth: 30,
    height: 28,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dealFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' },
  dealAdd: { width: 40, height: 40, borderRadius: 14, backgroundColor: fixed.orange, alignItems: 'center', justifyContent: 'center' },
  again: { width: 250, padding: 12, borderRadius: 22, borderWidth: 1, gap: 10 },
  reorder: { height: 40, borderRadius: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  ratedCard: { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  ratedRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12 },
  post: { width: 250, borderRadius: 22, borderWidth: 1, paddingTop: 7, paddingHorizontal: 7, paddingBottom: 14, gap: 10 },
  mode: { flexDirection: 'row', width: 200, height: 42, padding: 4, borderRadius: 21 },
  modePill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    width: 96,
    borderRadius: 17,
    shadowColor: '#FF7A1A',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  closed: {
    marginTop: 14,
    marginHorizontal: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
});
