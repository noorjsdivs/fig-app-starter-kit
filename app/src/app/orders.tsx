import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { orderStatus } from '@/components/account/status';
import { ScreenHeader, useChrome } from '@/components/ui/layout';
import { StatusPill } from '@/components/ui/controls';
import { DishImage } from '@/components/ui/media';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Reveal, RevealScope } from '@/components/ui/reveal';
import { Txt } from '@/components/ui/txt';
import { useStatusBar } from '@/hooks/use-status-bar';
import { cnt, money } from '@/lib/format';
import { selectMyOrders, useApp } from '@/store/app-store';
import { useTheme } from '@/theme/theme';

export default function MyOrdersScreen() {
  const { c } = useTheme();
  const chrome = useChrome();
  useStatusBar();
  const orders = useApp(useShallow(selectMyOrders));
  const dishOf = useApp((s) => s.dishOf);

  return (
    <RevealScope>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: chrome.underHeader, paddingHorizontal: 20, paddingBottom: 40, gap: 10 }}
        >
          {!orders.length ? (
            <Txt s={15} w={500} color={c.text2} align="center" style={{ marginTop: 40 }}>
              No orders yet.
            </Txt>
          ) : null}
          {orders.map((o) => {
            const st = orderStatus(o.step, c);
            const n = o.items.reduce((a, b) => a + b.q, 0);
            return (
              <Reveal key={o.no} i={0}>
                <PressableScale
                  scaleTo={0.98}
                  onPress={() => router.push({ pathname: '/track/[no]', params: { no: o.no } })}
                  style={[styles.row, { backgroundColor: c.surface1, borderColor: c.line }]}
                >
                  <DishImage uri={dishOf(o.items[0].id).img} size={58} />
                  <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                    <Txt s={15} w={700}>
                      {o.no}
                    </Txt>
                    <Txt s={12.5} color={c.text3}>
                      {o.time} · {cnt(n, 'item')}
                    </Txt>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <Txt s={14.5} w={700}>
                      {money(o.total)}
                    </Txt>
                    <StatusPill label={st.label} color={st.color} />
                  </View>
                </PressableScale>
              </Reveal>
            );
          })}
        </ScrollView>
        <ScreenHeader title="My orders" />
      </View>
    </RevealScope>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 20, borderWidth: 1 },
});
