import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { AdminHeader, DashedLine, useAdminPadding } from '@/components/admin/admin-ui';
import { Icon } from '@/components/icons/icon';
import { Check, ProgressBar } from '@/components/ui/controls';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { CUSTOMERS } from '@/data/seed';
import type { Order } from '@/data/types';
import { useStatusBar } from '@/hooks/use-status-bar';
import { lineMeta } from '@/lib/pricing';
import { useApp } from '@/store/app-store';
import { accentGradient } from '@/theme/tokens';
import { useTheme } from '@/theme/theme';

const custName = (id: string) => (CUSTOMERS.find((c) => c.id === id) ?? CUSTOMERS[0]).name;
const K_TABS: [string, 0 | 1][] = [
  ['New tickets', 0],
  ['On the line', 1],
];

export default function AdminKitchen() {
  return (
    <RevealScope>
      <Kitchen />
    </RevealScope>
  );
}

function Kitchen() {
  const { c } = useTheme();
  useStatusBar();
  const pad = useAdminPadding('tab');
  const orders = useApp((s) => s.orders);
  const [kTab, setKTab] = useState<0 | 1>(0);
  const [w, setW] = useState(0);
  const x = useSharedValue(0);

  useEffect(() => {
    x.set(withSpring(kTab === 1 ? (w - 8) / 2 : 0, { damping: 14, stiffness: 180, mass: 0.8 }));
  }, [kTab, w, x]);
  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  const tickets = orders.filter((o) => o.step === kTab);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={[pad, { gap: 10 }]} showsVerticalScrollIndicator={false}>
        <Reveal i={0}>
          <View style={[styles.seg, { backgroundColor: c.surface2 }]} onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}>
            {w ? (
              <Animated.View style={[styles.segPill, { width: (w - 8) / 2 }, pill]}>
                <LinearGradient colors={accentGradient} style={[StyleSheet.absoluteFill, { borderRadius: 19 }]} />
              </Animated.View>
            ) : null}
            {K_TABS.map(([l, k]) => {
              const on = kTab === k;
              return (
                <PressableScale key={l} onPress={() => setKTab(k)} scaleTo={0.97} style={styles.segBtn} accessibilityState={{ selected: on }}>
                  <Txt s={13.5} w={700} color={on ? c.accentInk : c.text2}>
                    {l}
                  </Txt>
                  <View style={styles.segCount}>
                    <Txt s={11} w={700} color={on ? c.accentInk : c.text2}>
                      {orders.filter((o) => o.step === k).length}
                    </Txt>
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </Reveal>
        {!tickets.length ? (
          <View style={styles.empty}>
            <Icon name="room_service" size={40} color={c.text3} />
            <Txt s={14.5} w={600} color={c.text2} align="center">
              {kTab === 0 ? 'No new tickets. The pass is clear.' : 'Nothing on the line right now.'}
            </Txt>
          </View>
        ) : null}
        {tickets.map((o, i) => (
          <Reveal key={o.no} i={1 + i} replay={kTab}>
            <Ticket order={o} />
          </Reveal>
        ))}
      </ScrollView>
      <AdminHeader title="Kitchen display" />
    </View>
  );
}

function Ticket({ order: o }: { order: Order }) {
  const { c } = useTheme();
  const prep = useApp((s) => s.prep);
  const dishOf = useApp((s) => s.dishOf);
  const done = useApp((s) => s.kDone[o.no]) ?? [];
  const toggle = useApp((s) => s.toggleKDone);
  const fire = useApp((s) => s.fireTicket);
  const m = o.mins || 0;
  const ageBg = m >= prep ? c.err : m >= prep * 0.6 ? c.warn : c.ok;
  const cta = o.step === 0 ? 'Fire ticket' : o.mode === 'pickup' ? 'Ready for pickup' : 'Ready · hand to courier';

  return (
    <View style={[styles.ticket, { borderColor: c.line, backgroundColor: c.surface1 }]}>
      <View style={styles.tHead}>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt s={18} w={600} ls={-0.01}>
            {o.no}
          </Txt>
          <Txt s={12.5} w={500} color={c.text3}>
            {custName(o.cid)} · {o.mode === 'pickup' ? 'Pickup' : 'Delivery'}
          </Txt>
        </View>
        <View style={[styles.age, { backgroundColor: ageBg }]}>
          <Icon name="timer" size={16} color="#FFFFFF" />
          <Txt s={12.5} w={700} color="#FFFFFF">
            {m} min
          </Txt>
        </View>
      </View>
      <DashedLine color={c.lineStrong} />
      <View style={{ paddingHorizontal: 14, paddingVertical: 4 }}>
        {o.items.map((it, k) => {
          const d = dishOf(it.id);
          const ck = done.includes(k);
          return (
            <PressableScale key={`${it.id}-${k}`} onPress={() => toggle(o.no, k)} scaleTo={0.985} style={[styles.item, { opacity: ck ? 0.45 : 1 }]}>
              <Check on={ck} />
              <Txt s={17} w={600} color={c.accentText} style={{ minWidth: 28 }}>
                {it.q}×
              </Txt>
              <View style={{ flex: 1, gap: 1 }}>
                <Txt s={14.5} w={700} strike={ck}>
                  {d.name}
                </Txt>
                {lineMeta(it, d) ? (
                  <Txt s={12} color={c.text3}>
                    {lineMeta(it, d)}
                  </Txt>
                ) : null}
              </View>
            </PressableScale>
          );
        })}
      </View>
      <ProgressBar pct={o.items.length ? (done.length / o.items.length) * 100 : 0} height={4} gradient duration={400} />
      <View style={{ padding: 10 }}>
        <PressableScale onPress={() => fire(o.no)} scaleTo={0.97} style={[styles.cta, { backgroundColor: c.text1 }]}>
          <Icon name={o.step === 0 ? 'eco' : 'room_service'} size={20} fill color={c.bg} />
          <Txt s={15} w={700} color={c.bg}>
            {cta}
          </Txt>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  seg: { height: 46, padding: 4, borderRadius: 23, flexDirection: 'row' },
  segPill: { position: 'absolute', top: 4, bottom: 4, left: 4, borderRadius: 19 },
  segBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  segCount: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { marginTop: 30, alignItems: 'center', gap: 8 },
  ticket: { borderRadius: 22, borderWidth: 1, overflow: 'hidden' },
  tHead: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 14, paddingHorizontal: 14, paddingBottom: 12 },
  age: { height: 30, paddingHorizontal: 10, borderRadius: 15, flexDirection: 'row', alignItems: 'center', gap: 5 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  cta: { height: 50, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
});
